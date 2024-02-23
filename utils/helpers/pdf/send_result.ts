import PDFDocument from 'pdfkit';
import fs from 'fs';
import transporter from '../../../config/email';

export default async (data : any,email : string | undefined) => {
    try{
        const doc  = new PDFDocument();
        doc.pipe(fs.createWriteStream('result.pdf'));
        doc.text(data);
        doc.end();
        
        const message = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: 'PDF Result',
            text: 'Please find the attached PDF document.',
            attachments: [
                {
                    filename: 'result.pdf',
                    path: 'result.pdf'
                }
            ]
        };

        transporter.sendMail(message, (error : any, info : any) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        return doc;
    }catch(err : any) {
        return err;
    }
}