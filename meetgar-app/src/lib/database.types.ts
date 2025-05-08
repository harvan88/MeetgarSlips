export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          codigo_unico: string | null
          creado_en: string | null
          estado: string | null
          id: string
          mesero_id: string | null
          restaurante_id: string | null
          user_id: string | null
        }
        Insert: {
          codigo_unico?: string | null
          creado_en?: string | null
          estado?: string | null
          id?: string
          mesero_id?: string | null
          restaurante_id?: string | null
          user_id?: string | null
        }
        Update: {
          codigo_unico?: string | null
          creado_en?: string | null
          estado?: string | null
          id?: string
          mesero_id?: string | null
          restaurante_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_mesero_id_fkey"
            columns: ["mesero_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_restaurante_id_fkey"
            columns: ["restaurante_id"]
            isOneToOne: false
            referencedRelation: "restaurantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos: {
        Row: {
          creado_en: string | null
          id: string
          metodo: string | null
          monto: number | null
          pagado_por_user_id: string | null
          slip_producto_id: string | null
        }
        Insert: {
          creado_en?: string | null
          id?: string
          metodo?: string | null
          monto?: number | null
          pagado_por_user_id?: string | null
          slip_producto_id?: string | null
        }
        Update: {
          creado_en?: string | null
          id?: string
          metodo?: string | null
          monto?: number | null
          pagado_por_user_id?: string | null
          slip_producto_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagos_pagado_por_user_id_fkey"
            columns: ["pagado_por_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_slip_producto_id_fkey"
            columns: ["slip_producto_id"]
            isOneToOne: false
            referencedRelation: "slip_productos"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          descripcion: string | null
          disponible: boolean | null
          id: string
          imagen_url: string | null
          nombre: string | null
          precio: number | null
          restaurante_id: string | null
        }
        Insert: {
          descripcion?: string | null
          disponible?: boolean | null
          id?: string
          imagen_url?: string | null
          nombre?: string | null
          precio?: number | null
          restaurante_id?: string | null
        }
        Update: {
          descripcion?: string | null
          disponible?: boolean | null
          id?: string
          imagen_url?: string | null
          nombre?: string | null
          precio?: number | null
          restaurante_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_restaurante_id_fkey"
            columns: ["restaurante_id"]
            isOneToOne: false
            referencedRelation: "restaurantes"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurantes: {
        Row: {
          codigo_unico: string | null
          creado_en: string | null
          id: string
          logo_url: string | null
          nombre: string
          owner_id: string | null
        }
        Insert: {
          codigo_unico?: string | null
          creado_en?: string | null
          id?: string
          logo_url?: string | null
          nombre: string
          owner_id?: string | null
        }
        Update: {
          codigo_unico?: string | null
          creado_en?: string | null
          id?: string
          logo_url?: string | null
          nombre?: string
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurantes_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      slip_autorizaciones: {
        Row: {
          creado_en: string | null
          estado: string | null
          id: string
          order_id: string | null
          solicitante_id: string | null
        }
        Insert: {
          creado_en?: string | null
          estado?: string | null
          id?: string
          order_id?: string | null
          solicitante_id?: string | null
        }
        Update: {
          creado_en?: string | null
          estado?: string | null
          id?: string
          order_id?: string | null
          solicitante_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "slip_autorizaciones_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slip_autorizaciones_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      slip_productos: {
        Row: {
          cantidad: number | null
          id: string
          precio_unitario: number | null
          producto_id: string | null
          slip_id: string | null
          total: number | null
        }
        Insert: {
          cantidad?: number | null
          id?: string
          precio_unitario?: number | null
          producto_id?: string | null
          slip_id?: string | null
          total?: number | null
        }
        Update: {
          cantidad?: number | null
          id?: string
          precio_unitario?: number | null
          producto_id?: string | null
          slip_id?: string | null
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "slip_productos_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slip_productos_slip_id_fkey"
            columns: ["slip_id"]
            isOneToOne: false
            referencedRelation: "slips"
            referencedColumns: ["id"]
          },
        ]
      }
      slips: {
        Row: {
          actualizado_en: string | null
          comentario: string | null
          creado_en: string | null
          estado: Database["public"]["Enums"]["estado_slip"] | null
          id: string
          order_id: string | null
          restaurante_id: string | null
          user_id: string | null
        }
        Insert: {
          actualizado_en?: string | null
          comentario?: string | null
          creado_en?: string | null
          estado?: Database["public"]["Enums"]["estado_slip"] | null
          id?: string
          order_id?: string | null
          restaurante_id?: string | null
          user_id?: string | null
        }
        Update: {
          actualizado_en?: string | null
          comentario?: string | null
          creado_en?: string | null
          estado?: Database["public"]["Enums"]["estado_slip"] | null
          id?: string
          order_id?: string | null
          restaurante_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "slips_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slips_restaurante_id_fkey"
            columns: ["restaurante_id"]
            isOneToOne: false
            referencedRelation: "restaurantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ubicaciones: {
        Row: {
          actualizado_en: string | null
          id: string
          latitud: number | null
          longitud: number | null
          restaurante_id: string | null
          user_id: string | null
        }
        Insert: {
          actualizado_en?: string | null
          id?: string
          latitud?: number | null
          longitud?: number | null
          restaurante_id?: string | null
          user_id?: string | null
        }
        Update: {
          actualizado_en?: string | null
          id?: string
          latitud?: number | null
          longitud?: number | null
          restaurante_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ubicaciones_restaurante_id_fkey"
            columns: ["restaurante_id"]
            isOneToOne: false
            referencedRelation: "restaurantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ubicaciones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          creado_en: string | null
          email: string | null
          id: string
          imagen_url: string | null
          nombre: string | null
          rol: Database["public"]["Enums"]["rol_usuario"] | null
        }
        Insert: {
          creado_en?: string | null
          email?: string | null
          id?: string
          imagen_url?: string | null
          nombre?: string | null
          rol?: Database["public"]["Enums"]["rol_usuario"] | null
        }
        Update: {
          creado_en?: string | null
          email?: string | null
          id?: string
          imagen_url?: string | null
          nombre?: string | null
          rol?: Database["public"]["Enums"]["rol_usuario"] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      autorizar_solicitud: {
        Args: { autorizacion_id: string; estado: string }
        Returns: undefined
      }
      set_restaurante_id: {
        Args: { id: string }
        Returns: undefined
      }
      solicitar_unirse: {
        Args: { codigo_unico: string; solicitante_id: string }
        Returns: undefined
      }
    }
    Enums: {
      estado_slip:
        | "pendiente"
        | "confirmado"
        | "en_preparacion"
        | "preparado"
        | "listo_para_entrega"
        | "entregado"
        | "cancelado"
        | "devuelto"
      rol_usuario:
        | "cliente"
        | "mesero"
        | "cocina"
        | "barra"
        | "caja"
        | "administracion"
        | "supervisor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      estado_slip: [
        "pendiente",
        "confirmado",
        "en_preparacion",
        "preparado",
        "listo_para_entrega",
        "entregado",
        "cancelado",
        "devuelto",
      ],
      rol_usuario: [
        "cliente",
        "mesero",
        "cocina",
        "barra",
        "caja",
        "administracion",
        "supervisor",
      ],
    },
  },
} as const
