import type { NextApiRequest, NextApiResponse } from "next";
import S3 from 'aws-sdk/clients/s3';
import { randomUUID } from "crypto";

const s3 = new S3({
    apiVersion: '2006-03-01',
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION,
    signatureVersion: 'v4'
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const fileType = req.query.fileType as string; // Es: image/jpeg o video/mp4
    const extension = fileType.split('/')[1];   // Prendi l'estensione del file (es: jpeg, mp4)
    const Key = `${randomUUID()}.${extension}`;

    const s3Params = {
        Bucket: process.env.BUCKET_NAME!,
        Key,
        Expires: 60, // il link scade dopo 60 secondi
        ContentType: fileType, // Usa direttamente il fileType
        ContentDisposition: 'inline'
    };

    try {
        const uploadUrl = await s3.getSignedUrlPromise('putObject', s3Params);

        res.status(200).json({
            uploadUrl,
            key: Key
        });
    } catch (error) {
        console.error("Error generating signed URL:", error);
        res.status(500).json({ error: "Error generating signed URL" });
    }
}
