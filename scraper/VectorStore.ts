import type { Document } from "@langchain/core/documents";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`)

const supabaseUrl = process.env.SUPABASE_URL
if (!supabaseUrl) throw new Error(`Expected env var SUPABASE_URL`)

export class VectorStore<T extends object = object> {
    private embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });
    private supabaseClient = createClient(
        supabaseUrl!,
        supabaseKey!
    );
    private vectorStore = new SupabaseVectorStore(this.embeddings, {
        client: this.supabaseClient,
        tableName: this.tableName,
        queryName: this.queryName,
    });

    constructor(private readonly tableName = "documents", private readonly queryName = "match_documents") { }

    public async addDocuments(documents: Document<T>[]) {
        return this.vectorStore.addDocuments(documents);
    }

    public async find(text: string, count = 3, metadata?: Partial<T>) {
        return await this.vectorStore.similaritySearch(text, count, metadata)
    }
}