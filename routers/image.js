const express = require('express')
const router = express.Router()
const psql = require('../postgres').pool
const jwt = require('../middleware/login')
const minio = require('minio')
const table = 'image'
const multer = require("multer")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/album/imagens")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },
})
const upload = multer({ storage })

const minioClient = new minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: (process.env.MINIO_SSL == 'true'),
    accessKey: process.env.MINIO_KEY,
    secretKey: process.env.MINIO_SECRET
});

/** 
 * API POST: Envia para o bucket Min.IO e registra com o parametro do id album.
 * 
 * Exemplo: { "imagem_album": file }
 */
router.post('/:id', jwt, upload.single('image_album'), (req, res, next) => {
    try {

        /** O TEMPO DE EXPIRACAO FOI DENIFIDO EM HORAS(3600) Segundos */
        let expire = 60 * 60
        let d = new Date();
        d.setHours(d.getHours() + (expire / 3600))

        const query = {
            text: 'INSERT INTO  ' + table + ' (url_image, original_image, file_image, size_image, fk_id_album, expire_image) ' +
                'VALUES($1, $2, $3, $4, $5, $6);',
            values: []
        }

        let Fs = require('fs')
        let file = req.file.destination + '/' + req.file.filename
        let fileStream = Fs.createReadStream(file)
        let fileStat = Fs.stat(file, (err, stats) => {
            if (err) throw new Error(err)
            minioClient.putObject(process.env.MINIO_BUCKET, req.file.filename, fileStream, stats.size, function (err, etag) {
                return
            })
        })

        minioClient.presignedUrl('GET', process.env.MINIO_BUCKET, req.file.filename, expire, function (err, presignedUrl) {
            if (err) throw new Error(err)
            query.values = [presignedUrl, req.file.filename, file, req.file.size, req.params.id, d]

            psql.query(query, (err, response) => {
                if (err) return res.status(500).send({ status: 500, message: 'The server detected a problem and was unable to return.' + err })
                if (response.rowCount) {
                    return res.status(201).send({ status: 201, message: 'success' })
                }
                return res.status(400).send({ status: 400, message: 'No results found!' })
            })
        })

    } catch (e) {
        return res.status(400).send({ status: 400, message: 'Error critical: ' + e })
    }
})

module.exports = router