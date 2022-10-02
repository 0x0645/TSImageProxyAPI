import express from "express";
import { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 9797;

    app.use(bodyParser.json());

    app.get("/filteredimage", async (req: Request, res: Response) => {
        let { image_url } = req.query;

        if (!image_url) {
            return res.status(400).send({message:"Including a image_url is mandatory."});
        }

        let file_path: string = await filterImageFromURL(image_url);
        return res.status(200).sendFile(file_path, async () => {
            await deleteLocalFiles([file_path]);
        });
    });

    app.get("/", async (req, res) => {
        res.send({message:'try GET /filteredimage?image_url={{}}'});
    });

    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();