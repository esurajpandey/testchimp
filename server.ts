import express, { Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes/index";
import assessmentRoute  from './routes/assessmentRoutes/index';
import candidateRoute from "./routes/candidateRoutes/index";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/TestGorilla", userRoutes);
app.use("/TestGorilla",assessmentRoute);
app.use("/TestGorilla",candidateRoute);


app.get("/api", (req: Request, resp: Response) => {
  resp.status(404).json({
    message: "page not found",
  });
});

app.get('/key',(req:Request,resp : Response)=>{
  resp.status(200).json({key : process.env.RAZOR_KEY_ID});
});


app.listen(5000, () => {
  console.log("Server listening at 5000");
});
