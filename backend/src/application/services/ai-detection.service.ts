import { Injectable } from '@nestjs/common';
import { EquipmentTypeService } from './equipment-type.service';
import { EquipmentType } from '../../domain/entities/equipment-type.entity';

interface AIDetectionResult {
    domain?: string;
    type?: string;
    category?: string;
    subcategory?: string;
    confidence: number;
    reasoning: string;
}

@Injectable()
export class AIDetectionService {
    private cachedHierarchySummary: string | null = null;
    private lastCacheUpdate: number = 0;
    private readonly CACHE_DURATION = 5 * 60 * 1000;

    constructor(private equipmentTypeService: EquipmentTypeService) { }

    async detectEquipmentType(
        name: string,
        brand: string,
        model: string,
        description?: string
    ): Promise<AIDetectionResult> {
        try {
            // Get all equipment types for context
            const equipmentTypes = await this.equipmentTypeService.findAll();

            // Create optimized prompt for ChatGPT
            const prompt = this.createOptimizedPrompt(name, brand, model, description, equipmentTypes);

            // Call ChatGPT API
            const aiResponse = await this.callChatGPT(prompt);

            // Parse AI response
            const detection = this.parseAIResponse(aiResponse);

            // Validate against existing equipment types
            const validatedDetection = this.validateDetection(detection, equipmentTypes);

            return validatedDetection;
        } catch (error) {
            console.error('AI detection failed:', error);
            return {
                confidence: 0,
                reasoning: 'AI detection service unavailable'
            };
        }
    }

    private createOptimizedPrompt(
        name: string,
        brand: string,
        model: string,
        description: string | undefined,
        equipmentTypes: EquipmentType[]
    ): string {
        // Get cached or create new hierarchy summary
        const hierarchySummary = this.getHierarchySummary(equipmentTypes);

        // Extract keywords for potential filtering
        const keywords = this.extractKeywords(name, brand, model, description);

        // Get relevant equipment types based on keywords
        const relevantTypes = this.getRelevantEquipmentTypes(equipmentTypes, keywords);

        return `You are an expert in equipment classification. Analyze the following equipment and suggest the most appropriate classification.

Equipment Details:
- Name: ${name}
- Brand: ${brand}
- Model: ${model}
${description ? `- Description: ${description}` : ''}

Keywords detected: ${keywords.join(', ')}

Available Equipment Types (4-level hierarchy):
${hierarchySummary}

${relevantTypes.length > 0 ? `Most relevant types based on keywords:
${this.formatRelevantTypes(relevantTypes)}` : ''}

EXAMPLES OF CORRECT CLASSIFICATIONS:
- "Vanne papillon" → PLOMBERIE → VANNE → VANNE PAPILLON
- "Vanne 3 voies" → PLOMBERIE → VANNE → VANNE 3 VOIES (V3V)
- "Compresseur frigorifique" → CVC → GROUPE FROID → A VIS
- "Cassette plafond" → CVC → EMETTEUR → VENTILO-CONVECTEUR → CASSETTE PLAFONNIERE
- "Tableau électrique" → ELECTRICITE COURANTS FORTS → ARMOIRE ELECTRIQUE → DIVISIONNAIRE

IMPORTANT: You must find the MOST SPECIFIC classification possible. Always try to identify the subcategory level if it exists.

Please respond in the following JSON format:
{
  "domain": "exact domain name from the list",
  "type": "exact type name from the list",
  "category": "exact category name from the list", 
  "subcategory": "exact subcategory name from the list",
  "confidence": 0.95,
  "reasoning": "Brief explanation of why this classification was chosen"
}

Rules:
1. Only use exact names from the provided list
2. If a level is not applicable, use null
3. Confidence should be between 0 and 1
4. ALWAYS try to find the most specific level (subcategory) first
5. Look for specific terms in the equipment name/description that match subcategories
6. If unsure about a level, use null for that level
7. Consider the keywords when making your selection
8. ALWAYS include all 4 classification levels (domain, type, category, subcategory)

For this equipment, look specifically for terms that might indicate a specific subcategory.`
    }

    private getHierarchySummary(equipmentTypes: EquipmentType[]): string {
        const now = Date.now();

        // Check if cache is still valid
        if (this.cachedHierarchySummary && (now - this.lastCacheUpdate) < this.CACHE_DURATION) {
            return this.cachedHierarchySummary;
        }

        // Create new summary
        const summary = this.createHierarchySummary(equipmentTypes);

        // Cache the result
        this.cachedHierarchySummary = summary;
        this.lastCacheUpdate = now;

        return summary;
    }

    private createHierarchySummary(equipmentTypes: EquipmentType[]): string {
        const summary: { [key: string]: any } = {};

        // Group by domain
        equipmentTypes.forEach(type => {
            if (type.level === 1) {
                summary[type.name] = { count: 0, types: {} };
            } else if (type.level === 2 && type.parent) {
                if (!summary[type.parent.name]) {
                    summary[type.parent.name] = { count: 0, types: {} };
                }
                summary[type.parent.name].types[type.name] = { count: 0, categories: {} };
                summary[type.parent.name].count++;
            } else if (type.level === 3 && type.parent?.parent) {
                const domain = type.parent.parent.name;
                const typeName = type.parent.name;
                if (!summary[domain]) summary[domain] = { count: 0, types: {} };
                if (!summary[domain].types[typeName]) {
                    summary[domain].types[typeName] = { count: 0, categories: {} };
                }
                summary[domain].types[typeName].categories[type.name] = { count: 0 };
                summary[domain].types[typeName].count++;
                summary[domain].count++;
            } else if (type.level === 4 && type.parent?.parent?.parent) {
                const domain = type.parent.parent.parent.name;
                const typeName = type.parent.parent.name;
                const category = type.parent.name;
                if (!summary[domain]) summary[domain] = { count: 0, types: {} };
                if (!summary[domain].types[typeName]) {
                    summary[domain].types[typeName] = { count: 0, categories: {} };
                }
                if (!summary[domain].types[typeName].categories[category]) {
                    summary[domain].types[typeName].categories[category] = { count: 0 };
                }
                summary[domain].types[typeName].categories[category].count++;
                summary[domain].types[typeName].count++;
                summary[domain].count++;
            }
        });

        // Convert to readable format
        let result = '';
        Object.entries(summary).forEach(([domain, data]: [string, any]) => {
            result += `\n${domain} (${data.count} total items):\n`;
            Object.entries(data.types).forEach(([type, typeData]: [string, any]) => {
                result += `  - ${type} (${typeData.count} categories)\n`;
                Object.entries(typeData.categories).forEach(([category, catData]: [string, any]) => {
                    result += `    * ${category} (${catData.count} subcategories)\n`;
                });
            });
        });

        return result;
    }

    private extractKeywords(name: string, brand: string, model: string, description?: string): string[] {
        const text = `${name} ${brand} ${model} ${description || ''}`.toLowerCase();
        const keywords = new Set<string>();

        // Enhanced categorized keywords
        const keywordCategories = {
            plomberie: [
                'vanne', 'valve', 'robinet', 'papillon', 'globe', 'bille', 'diaphragme',
                'tuyau', 'tube', 'conduite', 'canalisation', 'pompe', 'circulateur',
                'compteur', 'eau', 'chauffage', 'sanitaire', 'plomberie', 'hydraulique',
                '2 voies', '3 voies', 'v2v', 'v3v', 'equilibrage', 'decharge', 'detente'
            ],
            cvc: [
                'compresseur', 'condenser', 'evaporator', 'chiller', 'heater', 'pump',
                'fan', 'motor', 'cvc', 'hvac', 'climatisation', 'refrigeration',
                'ventilation', 'cassette', 'plafond', 'plafonniere', 'gainable',
                'split', 'monobloc', 'reversible', 'ventilo', 'convecteur',
                'radiateur', 'emetteur', 'unite', 'interieure', 'exterieure'
            ],
            electricite: [
                'tableau', 'armoire', 'disjoncteur', 'interrupteur', 'prise', 'cable',
                'electrique', 'electricite', 'courant', 'tension', 'puissance',
                'eclairage', 'lumiere', 'lampe', 'spot', 'baes', 'securite'
            ],
            incendie: [
                'detecteur', 'fumee', 'chaleur', 'incendie', 'securite', 'alarme',
                'sprinkler', 'extincteur', 'robinet', 'pompe', 'incendie', 'fire', 'smoke'
            ],
            metrologie: [
                'compteur', 'mesure', 'capteur', 'sonde', 'thermometre', 'manometre',
                'debitmetre', 'metrologie', 'instrumentation'
            ]
        };

        // Check each category
        Object.entries(keywordCategories).forEach(([category, words]) => {
            words.forEach(keyword => {
                if (text.includes(keyword)) {
                    keywords.add(category);
                    keywords.add(keyword);
                }
            });
        });

        return Array.from(keywords);
    }

    private getRelevantEquipmentTypes(equipmentTypes: EquipmentType[], keywords: string[]): EquipmentType[] {
        if (keywords.length === 0) return [];

        return equipmentTypes.filter(type => {
            const typeText = type.name.toLowerCase();
            return keywords.some(keyword => typeText.includes(keyword));
        });
    }

    private formatRelevantTypes(relevantTypes: EquipmentType[]): string {
        const grouped = relevantTypes.reduce((acc, type) => {
            const hierarchy = this.getEquipmentTypeHierarchy(type);
            const path = [hierarchy.domain, hierarchy.type, hierarchy.category, hierarchy.subcategory]
                .filter(Boolean)
                .join(' → ');

            if (!acc[path]) acc[path] = [];
            acc[path].push(type.name);
            return acc;
        }, {} as { [key: string]: string[] });

        return Object.entries(grouped)
            .map(([path, types]) => `${path}: ${types.join(', ')}`)
            .join('\n');
    }

    private getEquipmentTypeHierarchy(equipmentType: EquipmentType): {
        domain?: string;
        type?: string;
        category?: string;
        subcategory?: string;
    } {
        const pathParts: string[] = [];
        let currentType: EquipmentType | undefined = equipmentType;

        while (currentType) {
            pathParts.unshift(currentType.name);
            currentType = currentType.parent;
        }

        return {
            domain: pathParts[0],
            type: pathParts[1],
            category: pathParts[2],
            subcategory: pathParts[3],
        };
    }

    private async callChatGPT(prompt: string): Promise<string> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert equipment classifier. Respond only with valid JSON.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        console.log('Raw AI response:', aiResponse);
        return aiResponse;
    }

    private parseAIResponse(response: string): any {
        try {
            // Extract JSON from response (in case there's extra text)
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            throw new Error('Invalid AI response format');
        }
    }

    private validateDetection(
        detection: any,
        equipmentTypes: EquipmentType[]
    ): AIDetectionResult {
        const result: AIDetectionResult = {
            confidence: detection.confidence || 0,
            reasoning: detection.reasoning || 'No reasoning provided'
        };

        // Validate each level against existing equipment types
        if (detection.domain) {
            const domainExists = equipmentTypes.some(t =>
                t.level === 1 && t.name === detection.domain
            );
            if (domainExists) {
                result.domain = detection.domain;
            }
        }

        if (detection.type && detection.domain) {
            const typeExists = equipmentTypes.some(t =>
                t.level === 2 &&
                t.name === detection.type &&
                t.parent?.name === detection.domain
            );
            if (typeExists) {
                result.type = detection.type;
            }
        }

        if (detection.category && detection.type) {
            const categoryExists = equipmentTypes.some(t =>
                t.level === 3 &&
                t.name === detection.category &&
                t.parent?.name === detection.type
            );
            if (categoryExists) {
                result.category = detection.category;
            }
        }

        if (detection.subcategory && detection.category) {
            const subcategoryExists = equipmentTypes.some(t =>
                t.level === 4 &&
                t.name === detection.subcategory &&
                t.parent?.name === detection.category
            );
            if (subcategoryExists) {
                result.subcategory = detection.subcategory;
            }
        }

        return result;
    }
}