import type { NextApiRequest, NextApiResponse } from "next";
import S3 from 'aws-sdk/clients/s3';

const s3 = new S3({
    apiVersion: '2006-03-01',
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_KEY!,
    region: process.env.REGION!,
    signatureVersion: 'v4'
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const s3Params = {
            Bucket: process.env.BUCKET_NAME!
        };

        const data = await s3.listObjectsV2(s3Params).promise();
        const files = data.Contents?.map(item => item.Key) || [];

        res.status(200).json({ files });
    } catch (error) {
        console.error("Error fetching files from S3:", error);
        res.status(500).json({ error: "Error fetching files from S3" });
    }
}
