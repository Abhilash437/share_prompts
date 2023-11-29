import { connectDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (req, {params})=>{
    try {
        await connectDB();
        const prompt = await Prompt.findById(params.id).populate('creator')
        if(!prompt) return new Response("Prompt does not exists", {status:404})
        return new Response(JSON.stringify(prompt),{status:201}); 
    } catch (error) {
        console.log(error)
        return new Response("Failed to fetch the prompts",{status:500});
    }
}

export const PATCH = async (req, {params})=>{
    const {prompt, tag} = await req.json();
    try {
        await connectDB();
        const existingPrompt = await Prompt.findById(params.id)
        if(!existingPrompt) return new Response("Prompt does not exists",{status:404});
        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;
        await existingPrompt.save();
        return new Response(JSON.stringify(existingPrompt),{status:201});
    } catch (error) {
        console.log(error);
        return new Response("Failed to edit the prompt", {status:500});
    }
}

export const DELETE = async (request, { params }) => {
    try {
        await connectDB();

        // Find the prompt by ID and remove it
        await Prompt.findByIdAndDelete(params.id);

        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        return new Response("Error deleting prompt", { status: 500 });
    }
};