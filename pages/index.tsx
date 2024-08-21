import axios from 'axios';
import {ChangeEvent, useEffect, useState} from 'react';

async function uploadToS3(e: ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(e.target);
    const file = formData.get('file');  // attributo name dell'input type file

    if(!file) return null;

    // @ts-ignore
    const fileType = encodeURIComponent(file.type);

    const {data} = await axios.get(`/api/media?fileType=${fileType}`);
    const {uploadUrl, key} = data;

    await axios.put(uploadUrl, file);

    return key;
}

function Upload() {
    const [files, setFiles] = useState<string[]>([]);

    useEffect(() => {
        async function fetchFiles() {
            try {
                const { data } = await axios.get('/api/list');
                setFiles(data.files);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        }

        fetchFiles();
    }, []);

    async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        const key = await uploadToS3(e);
        if (key) {
            setFiles(prevFiles => [...prevFiles, key]);
        }
    }

    return (
        <>
            <p>Select a file to upload</p>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/jpeg, image/png, video/mp4, video/avi" name="file"/>
                <button type="submit">Upload</button>
            </form>

            <h2>Uploaded Files:</h2>
            <ul>
                {files.map((file, index) => (
                    <li key={index}>
                        <a href={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${file}`} target="_blank" rel="noopener noreferrer">
                            {file}
                        </a>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default Upload;

