# CDN-con-AWS-CloudFront-e-Bucket-S3

Il progetto consiste di una semplice applicazione che permette il caricamento di assets (immagini e video) su un bucket S3.
Gli assets non vengono caricati in maniera diretta ma vengono caricati mediante la richiesta al server di un presigned url per il caricamento sicuro sul bucket S3.
Per la distribuzione dei contenuti è stata realizzata una CDN (Content Delivery Network) con AWS CloudFront. 
