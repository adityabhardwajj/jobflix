import express from "express";
import { getNews } from "../controllers/newsController.js";

const router = express.Router();

/**
 * Public route - proxies to NewsAPI
 * Query params: q, pageSize, page, sources, country, category
 */
router.get("/", getNews);

export default router;



