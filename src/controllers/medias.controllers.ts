import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { USERS_MESSAGES } from '~/constants/messages'
import mediasService from '~/services/medias.services'
import fs from 'fs'
import HTTP_STATUS from '~/constants/httpStatus'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadVideo(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not found')
    }
  })
}

export const serveVideoStreamController = async (req: Request, res: Response, next: NextFunction) => {
  const range = req.headers.range
  if (!range) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Requires Range header')
  }
  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)
  const videoSize = fs.statSync(videoPath).size
  const chunkSize = 3 * 10 ** 6
  const start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + chunkSize, videoSize - 1)

  const contentLength = end - start + 1

  const contentType = (await import('mime')).default.getType(videoPath) || 'video/*'
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoSteams = fs.createReadStream(videoPath, { start, end })
  videoSteams.pipe(res)
}
