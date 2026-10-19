export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      tutor_conversas: {
        Row: {
          id: string;
          user_id: string;
          titulo: string;
          pasta: string;
          mensagens: string;
          versao: number;
          criada_em: string;
          atualizada_em: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          titulo: string;
          pasta: string;
          mensagens: string;
          versao?: number;
          criada_em?: string;
          atualizada_em?: string;
        };
        Update: {
          titulo?: string;
          pasta?: string;
          mensagens?: string;
          versao?: number;
          atualizada_em?: string;
        };
        Relationships: [];
      };
      assinaturas: {
        Row: {
          atualizado_em: string;
          plano: string;
          provider_customer_id: string | null;
          provider_subscription_id: string | null;
          status: string;
          user_id: string;
          valida_ate: string | null;
        };
        Insert: {
          atualizado_em?: string;
          plano?: string;
          provider_customer_id?: string | null;
          provider_subscription_id?: string | null;
          status?: string;
          user_id: string;
          valida_ate?: string | null;
        };
        Update: {
          atualizado_em?: string;
          plano?: string;
          provider_customer_id?: string | null;
          provider_subscription_id?: string | null;
          status?: string;
          user_id?: string;
          valida_ate?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "assinaturas_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      atividade_estudo: {
        Row: {
          acertos: number;
          data_local: string;
          respostas: number;
          user_id: string;
          xp: number;
        };
        Insert: {
          acertos?: number;
          data_local: string;
          respostas?: number;
          user_id: string;
          xp?: number;
        };
        Update: {
          acertos?: number;
          data_local?: string;
          respostas?: number;
          user_id?: string;
          xp?: number;
        };
        Relationships: [
          {
            foreignKeyName: "atividade_estudo_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      dificuldade_adaptativa: {
        Row: {
          assunto: string;
          nivel: string;
          user_id: string;
        };
        Insert: {
          assunto: string;
          nivel: string;
          user_id: string;
        };
        Update: {
          assunto?: string;
          nivel?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dificuldade_adaptativa_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      eventos_recompensa: {
        Row: {
          correta: number;
          corrigida: number;
          criado_em: string;
          id: string;
          user_id: string;
          xp: number;
        };
        Insert: {
          correta: number;
          corrigida: number;
          criado_em?: string;
          id: string;
          user_id: string;
          xp: number;
        };
        Update: {
          correta?: number;
          corrigida?: number;
          criado_em?: string;
          id?: string;
          user_id?: string;
          xp?: number;
        };
        Relationships: [
          {
            foreignKeyName: "eventos_recompensa_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      notas: {
        Row: {
          tutor_conversa_id: string | null;
          assunto: string;
          atualizada_em: string;
          conteudo: string;
          criada_em: string;
          id: string;
          titulo: string;
          user_id: string;
        };
        Insert: {
          tutor_conversa_id?: string | null;
          assunto: string;
          atualizada_em: string;
          conteudo?: string;
          criada_em: string;
          id: string;
          titulo: string;
          user_id: string;
        };
        Update: {
          tutor_conversa_id?: string | null;
          assunto?: string;
          atualizada_em?: string;
          conteudo?: string;
          criada_em?: string;
          id?: string;
          titulo?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notas_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      notas_historico: {
        Row: {
          conteudo_anterior: string;
          id: number;
          nota_id: string;
          salvo_em: string;
        };
        Insert: {
          conteudo_anterior: string;
          id?: number;
          nota_id: string;
          salvo_em: string;
        };
        Update: {
          conteudo_anterior?: string;
          id?: number;
          nota_id?: string;
          salvo_em?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notas_historico_nota_id_fkey";
            columns: ["nota_id"];
            isOneToOne: false;
            referencedRelation: "notas";
            referencedColumns: ["id"];
          },
        ];
      };
      perfis_estudo: {
        Row: {
          atualizado_em: string;
          melhor_sequencia: number;
          meta_diaria: number;
          ofensiva_dias: number;
          sequencia_acertos: number;
          total_xp: number;
          ultimo_estudo_em: string | null;
          user_id: string;
        };
        Insert: {
          atualizado_em?: string;
          melhor_sequencia?: number;
          meta_diaria?: number;
          ofensiva_dias?: number;
          sequencia_acertos?: number;
          total_xp?: number;
          ultimo_estudo_em?: string | null;
          user_id: string;
        };
        Update: {
          atualizado_em?: string;
          melhor_sequencia?: number;
          meta_diaria?: number;
          ofensiva_dias?: number;
          sequencia_acertos?: number;
          total_xp?: number;
          ultimo_estudo_em?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "perfis_estudo_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      progresso_licoes: {
        Row: {
          assunto: string;
          concluido_em: string;
          marco: string;
          user_id: string;
        };
        Insert: {
          assunto: string;
          concluido_em: string;
          marco: string;
          user_id: string;
        };
        Update: {
          assunto?: string;
          concluido_em?: string;
          marco?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "progresso_licoes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      quiz_resultados: {
        Row: {
          acertos: number;
          aprovado: number;
          assunto: string;
          formato: string;
          id: number;
          respondido_em: string;
          total: number;
          user_id: string;
        };
        Insert: {
          acertos: number;
          aprovado: number;
          assunto: string;
          formato: string;
          id?: number;
          respondido_em: string;
          total: number;
          user_id: string;
        };
        Update: {
          acertos?: number;
          aprovado?: number;
          assunto?: string;
          formato?: string;
          id?: number;
          respondido_em?: string;
          total?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_resultados_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      rate_limits: {
        Row: {
          chave_hash: string;
          expira_em: string;
          janela_inicio: string;
          requisicoes: number;
        };
        Insert: {
          chave_hash: string;
          expira_em: string;
          janela_inicio: string;
          requisicoes: number;
        };
        Update: {
          chave_hash?: string;
          expira_em?: string;
          janela_inicio?: string;
          requisicoes?: number;
        };
        Relationships: [];
      };
      respostas_calculo: {
        Row: {
          correta: number;
          diagnostico: string | null;
          id: number;
          questao_id: string;
          respondido_em: string;
          tempo_segundos: number;
          user_id: string;
          valor_digitado: number;
        };
        Insert: {
          correta: number;
          diagnostico?: string | null;
          id?: number;
          questao_id: string;
          respondido_em: string;
          tempo_segundos: number;
          user_id: string;
          valor_digitado: number;
        };
        Update: {
          correta?: number;
          diagnostico?: string | null;
          id?: number;
          questao_id?: string;
          respondido_em?: string;
          tempo_segundos?: number;
          user_id?: string;
          valor_digitado?: number;
        };
        Relationships: [
          {
            foreignKeyName: "respostas_calculo_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      respostas_questoes: {
        Row: {
          confianca: string | null;
          correta: number;
          corrigida: number;
          id: number;
          letra_escolhida: string;
          questao_id: string;
          respondido_em: string;
          tempo_segundos: number;
          user_id: string;
        };
        Insert: {
          confianca?: string | null;
          correta: number;
          corrigida?: number;
          id?: number;
          letra_escolhida: string;
          questao_id: string;
          respondido_em: string;
          tempo_segundos: number;
          user_id: string;
        };
        Update: {
          confianca?: string | null;
          correta?: number;
          corrigida?: number;
          id?: number;
          letra_escolhida?: string;
          questao_id?: string;
          respondido_em?: string;
          tempo_segundos?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "respostas_questoes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      sessoes: {
        Row: {
          criado_em: string;
          expira_em: string;
          token: string;
          user_id: string;
        };
        Insert: {
          criado_em?: string;
          expira_em: string;
          token: string;
          user_id: string;
        };
        Update: {
          criado_em?: string;
          expira_em?: string;
          token?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sessoes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          criado_em: string;
          email: string;
          id: string;
          nome: string;
          senha_hash: string;
          senha_salt: string;
        };
        Insert: {
          criado_em?: string;
          email: string;
          id: string;
          nome: string;
          senha_hash: string;
          senha_salt: string;
        };
        Update: {
          criado_em?: string;
          email?: string;
          id?: string;
          nome?: string;
          senha_hash?: string;
          senha_salt?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      gm_create_session: {
        Args: { p_expires: string; p_token: string; p_user_id: string };
        Returns: undefined;
      };
      gm_rate_limit: {
        Args: { p_expires: string; p_key: string; p_window: string };
        Returns: number;
      };
      gm_read_profile: {
        Args: { p_user_id: string };
        Returns: {
          acertos_hoje: number;
          melhor_sequencia: number;
          meta_diaria: number;
          ofensiva_dias: number;
          plano: string;
          respostas_hoje: number;
          sequencia_acertos: number;
          total_xp: number;
        }[];
      };
      gm_record_activity: {
        Args: {
          p_correct: boolean;
          p_corrected: boolean;
          p_event_id: string;
          p_user_id: string;
        };
        Returns: undefined;
      };
      gm_sync: { Args: { p_data: Json; p_user_id: string }; Returns: undefined };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
