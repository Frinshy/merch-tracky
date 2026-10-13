import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  // Ensure this is strictly restricted to development environment
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This endpoint is only available in development mode." },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as string;
    const era = formData.get("era") as string;
    const author = (formData.get("author") as string) || "Jeff";
    const imageFiles = formData.getAll("images") as File[];

    if (!id || !name) {
      return NextResponse.json(
        { error: "Missing required fields: id and name." },
        { status: 400 }
      );
    }

    const savedImages: { src: string; alt: string; author: string }[] = [];

    // Ensure public/items directory exists
    const publicItemsDir = path.join(process.cwd(), "public", "items");
    await fs.mkdir(publicItemsDir, { recursive: true });

    // Save uploaded images
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (file && typeof file === "object" && "arrayBuffer" in file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const ext = path.extname(file.name) || ".jpg";
        const filename = `${id}-${i + 1}-${Date.now()}${ext}`;
        const filePath = path.join(publicItemsDir, filename);

        await fs.writeFile(filePath, uint8Array);
        savedImages.push({
          src: `/items/${filename}`,
          alt: `${name} Image ${i + 1}`,
          author: author,
        });
      }
    }

    // If no images were uploaded, fallback to a default test image
    if (savedImages.length === 0) {
      savedImages.push({
        src: "/items/test.jpeg",
        alt: name,
        author: author,
      });
    }

    // Read and update data/merch-items.json
    const dataFilePath = path.join(process.cwd(), "data", "merch-items.json");
    let fileContent = "{\"MerchItems\": []}";
    try {
      fileContent = await fs.readFile(dataFilePath, "utf8");
    } catch {
      // file might not exist yet
    }

    const data = JSON.parse(fileContent);
    if (!data.MerchItems) {
      data.MerchItems = [];
    }

    const newItem = {
      id,
      name,
      description,
      type,
      era,
      images: savedImages,
    };

    data.MerchItems.push(newItem);

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      message: "Merch item added successfully! Review your git status and push when ready.",
      item: newItem,
    });
  } catch (error: any) {
    console.error("Error adding merch:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
