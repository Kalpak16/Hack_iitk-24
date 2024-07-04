const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const openai = require('openai');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Create a new OpenAI instance using the module
const configuration = {
  apiKey: 'sk-proj-IazqnwIFxmuOy0D0q0EzT3BlbkFJycGXzaJdtXSCAV5cp8RN',
  basePath: 'https://api.goose.ai/v1',
};

const openaiInstance = new openai(configuration);
app.post('/generate-narrative', async (req, res) => {
  const { interactions, focusData } = req.body;
  const prompt = `Summarize the following user interactions and focus data on a website:\n${JSON.stringify(interactions, null, 2)}\nFocus Data:\n${JSON.stringify(focusData, null, 2)}`;

  try {
    const completion = await openai.createCompletion({
      model: "gpt-j-6b",
      prompt: prompt,
      max_tokens: 150,
    });

    const narrative = completion.data.choices[0].text.trim();
    res.json({ narrative });
  } catch (error) {
    console.error('Error generating narrative:', error);
    res.status(500).send('Error generating narrative');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});