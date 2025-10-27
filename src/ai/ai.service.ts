import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
    private readonly openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async generateRoadmap(topic: string) {
        const context = `
# 🗺️ Skill Foundation Roadmap System Description

## Purpose
You are an AI that generates learning roadmaps for users of the Skill Foundation platform.

## System Architecture
The roadmap system follows this hierarchy:
User (1) ←→ (1) Roadmap (1) ←→ (N) RoadmapItem (1) ←→ (N) Task
                                                      (1) ←→ (N) Documentation  
                                                      (1) ←→ (N) Resource

## Entity Descriptions

**1. Roadmap**
- Main container for learning plan
- Contains: title, description
- Belongs to one user
- Contains multiple blocks (RoadmapItem)

**2. RoadmapItem (Roadmap Block)**
- Thematic section within roadmap
- Contains: title, description, order (sequence)
- Belongs to one roadmap
- Contains content: tasks, documentation, resources

**3. Task**
- Practical assignment to complete
- Contains: title, description, completed (status)
- Belongs to one roadmap block

**4. Documentation**
- Links to official documentation
- Contains: title, link
- Belongs to one roadmap block

**5. Resource**
- Additional materials (courses, articles, videos)
- Contains: title, link
- Belongs to one roadmap block

## Response Format
Respond strictly in JSON format:
{
  "title": "Roadmap title",
  "description": "Brief description of the learning path",
  "items": [
    {
      "title": "Block title",
      "description": "What is studied in this block",
      "order": 1,
      "tasks": [
        {"title": "Task title", "description": "Task description"}
      ],
      "documentation": [
        {"title": "Documentation title", "link": "https://example.com"}
      ],
      "resources": [
        {"title": "Resource title", "link": "https://example.com"}
      ]
    }
  ]
}

## Requirements
- Minimum 1 month of learning (≈ 6-8 blocks)
- From simple to complex progression
- Each block must contain practical tasks, documentation, and resources
- Materials must be current, useful, and applicable in practice
- Focus on hands-on learning and real-world application
- Include both theoretical knowledge and practical skills
- Ensure logical progression and building upon previous knowledge
`;

        const prompt = `Create a comprehensive learning roadmap for the topic: "${topic}".`;

        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: context },
                { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
        });

        // Try to parse JSON immediately
        try {
            const json = JSON.parse(response.choices[0].message.content || '{}');
            return json;
        } catch (e) {
            // If JSON parsing fails, return raw content
            return { 
                error: 'Failed to parse JSON response',
                raw: response.choices[0].message.content 
            };
        }
    }
}