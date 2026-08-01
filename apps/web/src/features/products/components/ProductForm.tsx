"use client";

import { useActionState, useEffect, useState } from "react";

import { createProduct } from "../actions/create-product";

import { generateSlug } from "@/utils/slug";
import { generateSKU } from "@/utils/sku";

const initialState = {
  success: false,
  message: "",
  errors: {},
};
