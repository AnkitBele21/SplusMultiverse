import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { loginRoute } from "./api/Login/login";
import {
  getPaymentOptions,
  recordAppPurchase,
  recordPayment,
  recordTopUpBalance,
} from "./api/Payment/payment";
import { turnOffFrame, turnOnFrame, updateFrameData } from "./api/Frame/frame";

dotenv.config();

const app: Express = express();

// Middleware for parsing request body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware to handle CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Simple Server");
});

app.post("/login", (req: Request, res: Response) => {
  loginRoute(req, res);
});

app.post("/record_payment/", (req: Request, res: Response) => {
  recordPayment(req, res);
});

app.post("/record_top_up/", (req: Request, res: Response) => {
  recordTopUpBalance(req, res);
});

app.post("/record_app_purchase/", (req: Request, res: Response) => {
  recordAppPurchase(req, res);
});

app.post("/payment/options/", (req: Request, res: Response) => {
  getPaymentOptions(req, res);
});

// New route for updating frame data
app.post("/update/frame/", (req: Request, res: Response) => {
  updateFrameData(req, res);
});

app.post("/update/frame/off/", (req: Request, res: Response) => {
  turnOffFrame(req, res);
});

app.post("/update/frame/on/", (req: Request, res: Response) => {
  turnOnFrame(req, res);
});

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
