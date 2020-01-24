import { Request, Response } from 'express';

import { UploadFileModel } from '../models';
import cloudinary from '../core/cloudinary';

export default class UploadFile {
	create = (req: Request, res: Response) => {
		const user = req.user._id;
		const { file } = req;
		cloudinary.v2.uploader
			.upload_stream({ resource_type: 'auto' }, async (err: any, uploadResult: any) => {
				if (err) return res.status(500).end();
				const { bytes, format, url, public_id } = uploadResult;
				const fileData = {
					filename: file.originalname,
					size: bytes,
					ext: format,
					url,
					user,
					public_id,
				};
				const uploadedFileData = new UploadFileModel(fileData);
				try {
					const response = await uploadedFileData.save();
					res.json(response).end();
				} catch (_err) {
					res.status(500).end();
				}
			})
			.end(file.buffer);
	};

	delete = async (req: Request, res: Response) => {
		const userId = req.user._id;
		const { id } = req.query;
		try {
			const fileForRemove: any = await UploadFileModel.findById(id);
			const { user, public_id } = fileForRemove;
			if (user.toString() !== userId) return res.status(404).end();
			const callback = async (err: any, removeResult: any) => {
				if (err) return res.status(500).end();
				await fileForRemove.remove();
				res.status(200).end();
			};
			cloudinary.v2.uploader.destroy(public_id, callback);
		} catch (err) {
			res.status(500).end();
		}
	};
}
