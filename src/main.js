// import { bootstrap } from "./app.bootstrap.js";

                 
//  bootstrap();

import { bootstrap } from "./app.bootstrap.js";

// Vercel يحتاج أن يجد export default ليتمكن من تشغيل الكود
export default async (req, res) => {
    const app = await bootstrap();
    app(req, res);
};