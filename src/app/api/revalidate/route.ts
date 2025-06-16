import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

function getPathFromUrl(key: string, url: string) {
    if (!url) return;

    const { search } = new URL(url);
    const urlParams = new URLSearchParams(search);
    return urlParams.get(key);
}

export async function GET(request: Request) {
    const path = getPathFromUrl("pathname", request.url)!;
    revalidatePath(path);

    return NextResponse.json({
        status: "OK",
    });
}
