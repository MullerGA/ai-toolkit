declare module '@xenova/transformers' {
  export function pipeline(
    task: string,
    model: string,
    options?: {
      progress_callback?: (progress: number) => void;
    }
  ): Promise<{
    (text: string, options: {
      max_length: number;
      temperature: number;
      num_return_sequences: number;
    }): Promise<Array<{ generated_text: string }>>;
  }>;
} 