"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot, X } from "lucide-react";

const API_KEY =
  "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";

const MODEL_LIST = [
  "amazon/nova-2-lite-v1:free",
  "arcee-ai/trinity-mini:free",
  "tngtech/tng-r1t-chimera:free",
  "allenai/olmo-3-32b-think:free",
  "kwaipilot/kat-coder-pro:free",
  "nvidia/nemotron-nano-12b-v2-vl:free",
  "alibaba/tongyi-deepresearch-30b-a3b:free",
  "meituan/longcat-flash-chat:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "openai/gpt-oss-120b:free",
  "openai/gpt-oss-20b:free",
  "z-ai/glm-4.5-air:free",
  "qwen/qwen3-coder:free",
  "moonshotai/kimi-k2:free",
  "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
  "google/gemma-3n-e2b-it:free",
  "tngtech/deepseek-r1t2-chimera:free",
  "google/gemma-3n-e4b-it:free",
  "qwen/qwen3-4b:free",
  "qwen/qwen3-235b-a22b:free",
  "tngtech/deepseek-r1t-chimera:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "google/gemma-3-4b-it:free",
  "google/gemma-3-12b-it:free",
  "google/gemma-3-27b-it:free",
  "google/gemini-2.0-flash-exp:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "mistralai/mistral-7b-instruct:free",
];

const CHESSLER_DATA = {
  "about": {
    "title": "About Chessler Chess Club",
    "about_text": "Established on 2nd November 2021 by Shubham Saini, Chessler Chess Club in Vaishali Nagar, Jaipur...",
    "team": {
      "title": "Our Team",
      "text": "Our team comprises AICF-CIS Certified Trainers and FIDE-rated professional chess players..."
    },
    "courses": { "title": "Our Courses" }
  },
  "alumni": [
    {
      "name": "Late Priyanshu Saini",
      "role": "Chess Trainer, Jaipur",
      "bio": "Late Priyanshu Saini was an inspiring figure...",
      "photo": "/assets/file_00000000274c71fa9d849e0a5ea46a56.png",
      "memoriam": "In loving memory of a true chess enthusiast and mentor."
    }
  ],
  "founder": {
    "name": "Shubham Saini",
    "title": "AICF Chess Trainer...",
    "experience": "Over 9 years of coaching experience...",
    "achievements": [
      "Multiple district, state, and university titles",
      "Competed at the national level",
      "South Asian Chess Championship 2016"
    ],
    "goal": "To inspire students to think deeply..."
  },
  "club_achievements": [
    {
      "name": "Kanishq Agarwal",
      "year": 2025,
      "rank": 2,
      "description": "2nd Rank in u07 category...",
      "location": "Jaipur, Rajasthan"
    }
  ],
  "contact": {
    "address": "A30b Jaanki Vihar, Dhawas Road, Heerapura Jaipur",
    "email": "chesslerclub@gmail.com",
    "phone": "+91-9314062064"
  }
};

async function askAI(userMessage: string) {
  for (const model of MODEL_LIST) {
    try {
      console.log(`🔄 Trying model: ${model}`);

      const response = await fetch("https://api.openrouter.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content:
                "You are Chessler AI. Always use provided Chessler club data when answering questions.",
            },
            {
              role: "user",
              content:
                userMessage +
                "\n\n------DATA JSON------\n" +
                JSON.stringify(CHESSLER_DATA),
            },
          ],
        }),
      });

      if (!response.ok) throw new Error("busy");

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      console.warn(`⚠️ Model busy: ${model}, trying next...`);
      continue;
    }
  }

  return "⚠️ All free models are busy, please try again later.";
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm Chessler AI Assistant. Ask me about courses, coaching, fees, trainers, or achievements.",
    },
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const user = { role: "user", content: input };
    setMessages((m) => [...m, user]);

    const reply = await askAI(input);
    setMessages((m) => [...m, { role: "assistant", content: reply }]);

    setInput("");
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-0 right-0 bg-white border w-full max-w-md h-[80vh] flex flex-col z-50">
          <div className="p-3 border-b flex justify-between">
            <h2 className="font-bold flex items-center gap-2">
              <Bot size={20} /> Chessler AI
            </h2>
            <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)}>
              <X />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className="p-2 bg-gray-100 rounded">
                {m.content}
              </div>
            ))}
          </div>

          <div className="p-3 flex gap-2 border-t">
            <input
              className="flex-1 border rounded p-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </div>
      )}
    </>
  );
}
