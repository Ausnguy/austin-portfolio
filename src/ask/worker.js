// Runs the language model off the main thread so the page stays responsive while it loads and writes.
import { pipeline, TextStreamer } from '@huggingface/transformers';
import { MODEL_ID } from './constants';

let generator = null;

const post = (message) => self.postMessage(message);

self.onmessage = async ({ data }) => {
  if (data.type === 'load') {
    if (generator) {
      post({ type: 'ready', device: data.device });
      return;
    }
    try {
      generator = await pipeline('text-generation', MODEL_ID, {
        device: data.device,
        dtype: data.dtype,
        progress_callback: (p) => {
          if (p.status === 'progress' || p.status === 'done') {
            post({ type: 'progress', file: p.file, loaded: p.loaded ?? 0, total: p.total ?? 0, done: p.status === 'done' });
          }
        },
      });
      post({ type: 'ready', device: data.device });
    } catch (error) {
      generator = null;
      post({ type: 'error', message: String(error?.message ?? error) });
    }
    return;
  }

  if (data.type === 'generate') {
    if (!generator) {
      post({ type: 'error', id: data.id, message: 'The model is not loaded yet.' });
      return;
    }
    try {
      const streamer = new TextStreamer(generator.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: (text) => post({ type: 'token', id: data.id, text }),
      });
      // Render the chat template ourselves so Qwen3's thinking mode can be switched off.
      const prompt = generator.tokenizer.apply_chat_template(data.messages, {
        tokenize: false,
        add_generation_prompt: true,
        enable_thinking: false,
      });
      await generator(prompt, {
        add_special_tokens: false,
        return_full_text: false,
        max_new_tokens: 140,
        do_sample: false,
        repetition_penalty: 1.05,
        streamer,
      });
      post({ type: 'done', id: data.id });
    } catch (error) {
      post({ type: 'error', id: data.id, message: String(error?.message ?? error) });
    }
  }
};
