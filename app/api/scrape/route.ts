import { NextRequest, NextResponse } from "next/server";
import { runScraper, searchStore } from "@/scraper/index"; // Adjust path if needed

export async function POST() {
    const result = await runScraper(); // Ensure `runScraper` is an async function
    console.log(result);
    return NextResponse.json({ success: true, data: result });
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ success: false, error: "Missing query parameter" }, { status: 400 });
    }

    console.log(`Searching for: ${query}`);
    const result = await searchStore(query); // Assuming `runScraper` can take a query
    return NextResponse.json({ success: true, data: result });
}
