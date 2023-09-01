import cron from "node-cron";
import fs from "fs";
import { User } from "../models/User.js";

cron.schedule('* */30 * * * *', pruneImages); //prune every 12 hours

async function pruneImages(){
    const imagesFolderPath = 'uploads/';
    fs.readdir(imagesFolderPath, async(err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
    
        const imageFiles = files.filter(file => {
            const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp']; //these were the allowed mimetypes
            const ext = file.slice(file.lastIndexOf('.')).toLowerCase();
            return extensions.includes(ext);
        }); 
        if(imageFiles?.length == 0){
            console.log('no traffic in server yet!!')
            return 
        }

        const users = await User.findAll({ attributes: ['id','image'], raw: true, group:['image']});
        if(users?.length == 0){
            return //all ok
        }
        //filter images alone
        const used_images = users.map((v)=>{
            return v.image
        })
        
        const unused_images = imageFiles.filter(value => !used_images.includes(value));
        if(unused_images?.length == 0){
            console.log('Nothing to prune!! all clear')
            return 
        }
        unused_images.forEach(imageName => {
            const imagePath = `${imagesFolderPath}/${imageName}`;
            
            try {
                fs.unlinkSync(imagePath);
                console.log(`${imageName} deleted successfully.`);
            } catch (error) {
                console.error(`Error deleting ${imageName}:`, error);
            }
        });

    });
}