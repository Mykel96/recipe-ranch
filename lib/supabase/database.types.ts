export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          updated_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          description: string;
          emoji: string;
          category: string;
          tags: string[];
          cook_time_minutes: number;
          cook_time_label: string;
          servings: number;
          ingredients: Record<string, unknown>[];
          steps: Record<string, unknown>[];
          image_url: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          description: string;
          emoji?: string;
          category: string;
          tags?: string[];
          cook_time_minutes: number;
          cook_time_label: string;
          servings: number;
          ingredients?: Record<string, unknown>[];
          steps?: Record<string, unknown>[];
          image_url?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          emoji?: string;
          category?: string;
          tags?: string[];
          cook_time_minutes?: number;
          cook_time_label?: string;
          servings?: number;
          ingredients?: Record<string, unknown>[];
          steps?: Record<string, unknown>[];
          image_url?: string | null;
          published?: boolean;
          updated_at?: string;
        };
      };
      favorites: {
        Row: {
          user_id: string;
          recipe_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          recipe_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          recipe_id?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          recipe_id: string;
          author_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          author_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          updated_at?: string;
        };
      };
      ratings: {
        Row: {
          user_id: string;
          recipe_id: string;
          score: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          recipe_id: string;
          score: number;
          created_at?: string;
        };
        Update: {
          score?: number;
        };
      };
    };
  };
}
