import type { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Riigiteataja } from "./Riigiteataja";
import { VectorStore } from "./VectorStore";

interface Metadata {
    id: string;
    name: string;
}

export class Scraper {
    private readonly riigiteataja = new Riigiteataja();
    private readonly store = new VectorStore<Metadata>();
    private readonly textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
    });

    private async pullLaw(id: string, name: string): Promise<Document<Metadata>[]> {
        const text = await this.riigiteataja.getLaw(id);
        const chunks = await this.textSplitter.splitText(text);
        return chunks.map(chunk => ({ pageContent: chunk, metadata: { id, name } }));
    }

    public async chunkAndStoreLaws(lawsMap: Record<string, string>) {
        const laws = await Promise.all(Object.entries(lawsMap).map(async ([id, name]) => this.pullLaw(id, name)));
        const documents = laws.flat();
        return this.store.addDocuments(documents);
    }
}