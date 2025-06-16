import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
    revalidatePath('/en-US');

    return NextResponse.json({
        status: 'OK'
    });
}