import { type Request, type Response } from "express";
import { prisma } from "./prisma.ts";
import supabase from "./supabaseController.ts";

const handleUpload = async (req: Request, res: Response) => {
  try {
    const filePath = `/${req.user.email}/${res.locals.name}`;

    const { data, error } = await supabase.storage
      .from("Profiles")
      .upload(filePath, req.file.buffer, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.log(error);
    } else {
      console.log("File Uploaded");
    }

    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        url: filePath,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export { handleUpload };
