require("dotenv").config();
const express = require("express");

const cors = require("cors");
const admin = require("firebase-admin");
const Stripe = require("stripe");

const app = express();

app.use(cors());
app.use(express.json());
