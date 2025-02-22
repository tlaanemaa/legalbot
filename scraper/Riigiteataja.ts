import fetch from "node-fetch";
import pLimit from 'p-limit';

const limit = pLimit(1);

export class Riigiteataja {
    private baseUrl = "https://www.riigiteataja.ee";

    public async getLaw(id: string) {
        return await limit(() => fetch(`${this.baseUrl}/akt/${id}.txt`).then(res => res.text()));
    }
}
