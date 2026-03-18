const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');

const searchProductsTool = {
    name: "searchProducts",
    description: "Search for products in the store inventory based on a keyword.",
    parameters: {
        type: "OBJECT",
        properties: {
            keyword: {
                type: "STRING",
                description: "The search term (e.g., 'phone', 'camera', 'Sony').",
            },
            maxPrice: {
                type: "NUMBER",
                description: "The maximum price limit (e.g., 500).",
            },
        },
        required: ["keyword"],
    },
};

const searchProductFunction = async (keyword, maxPrice) => {
    try {
        console.log(`🕵️ AI searching for: "${keyword}"`);
        let query = {
            name: { $regex: keyword, $options: 'i' }
        };

        if (maxPrice) {
            query.price = { $lte: maxPrice }; 
        }
        const products = await Product.find(query).limit(5);

        if (products.length === 0) return "No products found.";

        return products.map(p => 
            `- ${p.name} ($${p.price}): ${p.description}. Stock: ${p.countInStock}`
        ).join('\n');
    } catch (e) {
        console.error(e);
        return "Database error occurred.";
    }
}

const chatWithAi = async (req, res) => {
    const { message, history } = req.body;

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            systemInstruction: {
                parts: [{ text: `
                    You are an enthusiastic Sales Assistant for a Tech E-Commerce Store.
                    
                    YOUR GOAL:
                    Help users find products, check prices, and answer questions about our inventory using the 'searchProducts' tool.

                    YOUR RULES:
                    1. STRICTLY REFUSE to answer questions about politics, religion, coding, or general knowledge unrelated to our products.
                    2. If asked a non-shopping question, say: "I'm sorry, I can only assist with our store's products."
                    3. Keep your answers short, friendly, and professional.
                    4. Never mention you are an AI model. Act like a helpful store employee.
                `}]
            },
            tools: [{ functionDeclarations: [searchProductsTool] }],
        });

        const chat = model.startChat({ history: history || [] });
        const result = await chat.sendMessage(message);
        const response = result.response;
        const functionCalls = response.functionCalls();

        let finalText = "";

        if (functionCalls && functionCalls.length > 0) {
            const call = functionCalls[0];
            
            if (call.name === "searchProducts") {
                const apiArgs = call.args;
                const productData = await searchProductFunction(apiArgs.keyword);
                
                const result2 = await chat.sendMessage([{
                    functionResponse: {
                        name: "searchProducts",
                        response: { name: "searchProducts", content: productData }
                    }
                }]);
                
                finalText = result2.response.text();
            }
        } else {
            finalText = response.text();
        }

        res.json({ reply: finalText });

    } catch (e) {
        console.error("AI Error:", e);
        res.status(500).json({ message: 'AI failed to respond' });
    }
}

module.exports = { chatWithAi };