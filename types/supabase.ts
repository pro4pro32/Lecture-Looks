export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      look_categories: {
        Row: {
          category_id: string;
          created_at: string;
          look_id: string;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          look_id: string;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          look_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "look_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "look_categories_look_id_fkey";
            columns: ["look_id"];
            isOneToOne: false;
            referencedRelation: "looks";
            referencedColumns: ["id"];
          },
        ];
      };
      look_items: {
        Row: {
          affiliate_url: string | null;
          brand: string | null;
          created_at: string;
          id: string;
          image_url: string | null;
          look_id: string;
          name: string;
          price: number;
        };
        Insert: {
          affiliate_url?: string | null;
          brand?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          look_id: string;
          name: string;
          price: number;
        };
        Update: {
          affiliate_url?: string | null;
          brand?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          look_id?: string;
          name?: string;
          price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "look_items_look_id_fkey";
            columns: ["look_id"];
            isOneToOne: false;
            referencedRelation: "looks";
            referencedColumns: ["id"];
          },
        ];
      };
      look_tags: {
        Row: {
          created_at: string;
          look_id: string;
          tag_id: string;
        };
        Insert: {
          created_at?: string;
          look_id: string;
          tag_id: string;
        };
        Update: {
          created_at?: string;
          look_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "look_tags_look_id_fkey";
            columns: ["look_id"];
            isOneToOne: false;
            referencedRelation: "looks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "look_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      looks: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          image_url: string;
          title: string;
          total_price: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url: string;
          title: string;
          total_price: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string;
          title?: string;
          total_price?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "looks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          id: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          id: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          id?: string;
          username?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
