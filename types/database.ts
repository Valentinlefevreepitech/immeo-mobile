export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      activities: {
        Row: {
          activity_date: string | null;
          activity_time: string | null;
          apartment_id: string | null;
          copropriete_id: string;
          created_at: string;
          created_by: string;
          description: string | null;
          id: string;
          link: string | null;
          reference_id: string | null;
          reference_type: string | null;
          titre: string;
          type: string;
        };
        Insert: {
          activity_date?: string | null;
          activity_time?: string | null;
          apartment_id?: string | null;
          copropriete_id: string;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          id?: string;
          link?: string | null;
          reference_id?: string | null;
          reference_type?: string | null;
          titre: string;
          type: string;
        };
        Update: {
          activity_date?: string | null;
          activity_time?: string | null;
          apartment_id?: string | null;
          copropriete_id?: string;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          id?: string;
          link?: string | null;
          reference_id?: string | null;
          reference_type?: string | null;
          titre?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'activities_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'activities_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'activities_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
          {
            foreignKeyName: 'activities_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'activities_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'activities_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'activities_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'activities_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      apartment_documents: {
        Row: {
          apartment_id: string;
          date_document: string | null;
          description: string | null;
          file_name: string;
          file_path: string;
          file_size: number | null;
          id: string;
          mime_type: string | null;
          tenant_id: string | null;
          type: string;
          uploaded_at: string | null;
          uploaded_by: string | null;
        };
        Insert: {
          apartment_id: string;
          date_document?: string | null;
          description?: string | null;
          file_name: string;
          file_path: string;
          file_size?: number | null;
          id?: string;
          mime_type?: string | null;
          tenant_id?: string | null;
          type: string;
          uploaded_at?: string | null;
          uploaded_by?: string | null;
        };
        Update: {
          apartment_id?: string;
          date_document?: string | null;
          description?: string | null;
          file_name?: string;
          file_path?: string;
          file_size?: number | null;
          id?: string;
          mime_type?: string | null;
          tenant_id?: string | null;
          type?: string;
          uploaded_at?: string | null;
          uploaded_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'apartment_documents_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'apartment_documents_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'apartment_documents_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
          {
            foreignKeyName: 'apartment_documents_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'apartment_documents_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['tenant_id'];
          },
          {
            foreignKeyName: 'apartment_documents_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['tenant_id'];
          },
        ];
      };
      apartments: {
        Row: {
          balcon: boolean | null;
          batiment: string | null;
          cave: boolean | null;
          charges: number | null;
          cle_boite_lettres: string | null;
          code_entree: string | null;
          copropriete_id: string;
          created_at: string;
          created_by: string;
          date_derniere_revision_loyer: string | null;
          date_entree: string | null;
          date_sortie: string | null;
          depot_garantie: number | null;
          espace_exterieur: boolean | null;
          etage: number | null;
          floor: number | null;
          id: string;
          jardin: boolean | null;
          last_payment: string | null;
          loyer: number | null;
          loyer_initial: number | null;
          nombre_pieces: number | null;
          numero: string;
          parking_inclus: boolean | null;
          porte: string | null;
          status: string | null;
          superficie: number | null;
          superficie_exterieure: number | null;
          surface: number | null;
          tenant_email: string | null;
          tenant_name: string | null;
          tenant_phone: string | null;
          terrasse: boolean | null;
          type_lot: string | null;
          type_occupation: Database['public']['Enums']['type_occupation'] | null;
          updated_at: string;
        };
        Insert: {
          balcon?: boolean | null;
          batiment?: string | null;
          cave?: boolean | null;
          charges?: number | null;
          cle_boite_lettres?: string | null;
          code_entree?: string | null;
          copropriete_id: string;
          created_at?: string;
          created_by?: string;
          date_derniere_revision_loyer?: string | null;
          date_entree?: string | null;
          date_sortie?: string | null;
          depot_garantie?: number | null;
          espace_exterieur?: boolean | null;
          etage?: number | null;
          floor?: number | null;
          id?: string;
          jardin?: boolean | null;
          last_payment?: string | null;
          loyer?: number | null;
          loyer_initial?: number | null;
          nombre_pieces?: number | null;
          numero: string;
          parking_inclus?: boolean | null;
          porte?: string | null;
          status?: string | null;
          superficie?: number | null;
          superficie_exterieure?: number | null;
          surface?: number | null;
          tenant_email?: string | null;
          tenant_name?: string | null;
          tenant_phone?: string | null;
          terrasse?: boolean | null;
          type_lot?: string | null;
          type_occupation?: Database['public']['Enums']['type_occupation'] | null;
          updated_at?: string;
        };
        Update: {
          balcon?: boolean | null;
          batiment?: string | null;
          cave?: boolean | null;
          charges?: number | null;
          cle_boite_lettres?: string | null;
          code_entree?: string | null;
          copropriete_id?: string;
          created_at?: string;
          created_by?: string;
          date_derniere_revision_loyer?: string | null;
          date_entree?: string | null;
          date_sortie?: string | null;
          depot_garantie?: number | null;
          espace_exterieur?: boolean | null;
          etage?: number | null;
          floor?: number | null;
          id?: string;
          jardin?: boolean | null;
          last_payment?: string | null;
          loyer?: number | null;
          loyer_initial?: number | null;
          nombre_pieces?: number | null;
          numero?: string;
          parking_inclus?: boolean | null;
          porte?: string | null;
          status?: string | null;
          superficie?: number | null;
          superficie_exterieure?: number | null;
          surface?: number | null;
          tenant_email?: string | null;
          tenant_name?: string | null;
          tenant_phone?: string | null;
          terrasse?: boolean | null;
          type_lot?: string | null;
          type_occupation?: Database['public']['Enums']['type_occupation'] | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'apartments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'apartments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'apartments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'apartments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'apartments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      app_config: {
        Row: {
          created_at: string | null;
          key: string;
          value: string;
        };
        Insert: {
          created_at?: string | null;
          key: string;
          value: string;
        };
        Update: {
          created_at?: string | null;
          key?: string;
          value?: string;
        };
        Relationships: [];
      };
      appels_de_fonds: {
        Row: {
          annee: number;
          appel_url: string | null;
          coproprietaire_id: string | null;
          copropriete_id: string;
          created_at: string;
          created_by: string;
          date_appel: string;
          date_echeance: string | null;
          date_paiement: string | null;
          id: string;
          libelle: string | null;
          montant_appele: number;
          montant_paye: number | null;
          reste_a_payer: number | null;
          statut: string | null;
          trimestre: number | null;
          updated_at: string;
        };
        Insert: {
          annee: number;
          appel_url?: string | null;
          coproprietaire_id?: string | null;
          copropriete_id: string;
          created_at?: string;
          created_by?: string;
          date_appel: string;
          date_echeance?: string | null;
          date_paiement?: string | null;
          id?: string;
          libelle?: string | null;
          montant_appele: number;
          montant_paye?: number | null;
          reste_a_payer?: number | null;
          statut?: string | null;
          trimestre?: number | null;
          updated_at?: string;
        };
        Update: {
          annee?: number;
          appel_url?: string | null;
          coproprietaire_id?: string | null;
          copropriete_id?: string;
          created_at?: string;
          created_by?: string;
          date_appel?: string;
          date_echeance?: string | null;
          date_paiement?: string | null;
          id?: string;
          libelle?: string | null;
          montant_appele?: number;
          montant_paye?: number | null;
          reste_a_payer?: number | null;
          statut?: string | null;
          trimestre?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'appels_de_fonds_coproprietaire_id_fkey';
            columns: ['coproprietaire_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietaires';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'appels_de_fonds_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'appels_de_fonds_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'appels_de_fonds_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'appels_de_fonds_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'appels_de_fonds_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      assemblees: {
        Row: {
          convocation_url: string | null;
          convocations_envoyees: boolean | null;
          copropriete_id: string;
          created_at: string;
          created_by: string;
          date_assemblee: string;
          date_envoi_convocations: string | null;
          description: string | null;
          feuille_presence_url: string | null;
          heure: string | null;
          id: string;
          lieu: string | null;
          ordre_jour: string[] | null;
          participants_presents: number | null;
          participants_representes: number | null;
          participants_total: number | null;
          procurations_acceptees: boolean | null;
          pv_url: string | null;
          quorum_atteint: boolean | null;
          quorum_requis: number | null;
          resolutions: Json | null;
          statut: string | null;
          tantiemes_presents: number | null;
          titre: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          convocation_url?: string | null;
          convocations_envoyees?: boolean | null;
          copropriete_id: string;
          created_at?: string;
          created_by?: string;
          date_assemblee: string;
          date_envoi_convocations?: string | null;
          description?: string | null;
          feuille_presence_url?: string | null;
          heure?: string | null;
          id?: string;
          lieu?: string | null;
          ordre_jour?: string[] | null;
          participants_presents?: number | null;
          participants_representes?: number | null;
          participants_total?: number | null;
          procurations_acceptees?: boolean | null;
          pv_url?: string | null;
          quorum_atteint?: boolean | null;
          quorum_requis?: number | null;
          resolutions?: Json | null;
          statut?: string | null;
          tantiemes_presents?: number | null;
          titre: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          convocation_url?: string | null;
          convocations_envoyees?: boolean | null;
          copropriete_id?: string;
          created_at?: string;
          created_by?: string;
          date_assemblee?: string;
          date_envoi_convocations?: string | null;
          description?: string | null;
          feuille_presence_url?: string | null;
          heure?: string | null;
          id?: string;
          lieu?: string | null;
          ordre_jour?: string[] | null;
          participants_presents?: number | null;
          participants_representes?: number | null;
          participants_total?: number | null;
          procurations_acceptees?: boolean | null;
          pv_url?: string | null;
          quorum_atteint?: boolean | null;
          quorum_requis?: number | null;
          resolutions?: Json | null;
          statut?: string | null;
          tantiemes_presents?: number | null;
          titre?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'assemblees_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'assemblees_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'assemblees_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'assemblees_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'assemblees_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      budget_items: {
        Row: {
          annee: number;
          categorie: string;
          copropriete_id: string;
          created_at: string;
          created_by: string;
          ecart: number | null;
          id: string;
          previsionnel: number;
          realise: number | null;
          seuil_alerte: number | null;
          sous_categorie: string | null;
          updated_at: string;
        };
        Insert: {
          annee: number;
          categorie: string;
          copropriete_id: string;
          created_at?: string;
          created_by?: string;
          ecart?: number | null;
          id?: string;
          previsionnel?: number;
          realise?: number | null;
          seuil_alerte?: number | null;
          sous_categorie?: string | null;
          updated_at?: string;
        };
        Update: {
          annee?: number;
          categorie?: string;
          copropriete_id?: string;
          created_at?: string;
          created_by?: string;
          ecart?: number | null;
          id?: string;
          previsionnel?: number;
          realise?: number | null;
          seuil_alerte?: number | null;
          sous_categorie?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'budget_items_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'budget_items_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'budget_items_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'budget_items_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'budget_items_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      cabinet_invitations: {
        Row: {
          accepted_at: string | null;
          accepted_by_user_id: string | null;
          cabinet_id: string;
          created_at: string;
          email: string;
          expires_at: string;
          id: string;
          invited_by: string;
          role: string;
          status: string;
          token: string;
        };
        Insert: {
          accepted_at?: string | null;
          accepted_by_user_id?: string | null;
          cabinet_id: string;
          created_at?: string;
          email: string;
          expires_at?: string;
          id?: string;
          invited_by: string;
          role?: string;
          status?: string;
          token?: string;
        };
        Update: {
          accepted_at?: string | null;
          accepted_by_user_id?: string | null;
          cabinet_id?: string;
          created_at?: string;
          email?: string;
          expires_at?: string;
          id?: string;
          invited_by?: string;
          role?: string;
          status?: string;
          token?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cabinet_invitations_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
        ];
      };
      cabinet_members: {
        Row: {
          cabinet_id: string;
          id: string;
          invited_by: string | null;
          joined_at: string;
          role: string;
          user_id: string;
        };
        Insert: {
          cabinet_id: string;
          id?: string;
          invited_by?: string | null;
          joined_at?: string;
          role?: string;
          user_id: string;
        };
        Update: {
          cabinet_id?: string;
          id?: string;
          invited_by?: string | null;
          joined_at?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cabinet_members_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
        ];
      };
      cabinets: {
        Row: {
          adresse: string | null;
          code_postal: string | null;
          created_at: string;
          created_by: string;
          email_contact: string | null;
          id: string;
          nom: string;
          siret: string | null;
          telephone: string | null;
          updated_at: string;
          ville: string | null;
        };
        Insert: {
          adresse?: string | null;
          code_postal?: string | null;
          created_at?: string;
          created_by: string;
          email_contact?: string | null;
          id?: string;
          nom: string;
          siret?: string | null;
          telephone?: string | null;
          updated_at?: string;
          ville?: string | null;
        };
        Update: {
          adresse?: string | null;
          code_postal?: string | null;
          created_at?: string;
          created_by?: string;
          email_contact?: string | null;
          id?: string;
          nom?: string;
          siret?: string | null;
          telephone?: string | null;
          updated_at?: string;
          ville?: string | null;
        };
        Relationships: [];
      };
      caretakers: {
        Row: {
          address: string | null;
          city: string | null;
          copropriete_id: string;
          created_at: string | null;
          email: string | null;
          first_name: string | null;
          id: number;
          last_name: string;
          phone: string | null;
          schedule: Json | null;
          updated_at: string | null;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          copropriete_id: string;
          created_at?: string | null;
          email?: string | null;
          first_name?: string | null;
          id?: number;
          last_name: string;
          phone?: string | null;
          schedule?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          copropriete_id?: string;
          created_at?: string | null;
          email?: string | null;
          first_name?: string | null;
          id?: number;
          last_name?: string;
          phone?: string | null;
          schedule?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'caretakers_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: true;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'caretakers_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: true;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'caretakers_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: true;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'caretakers_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: true;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'caretakers_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: true;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      chats: {
        Row: {
          actif: boolean | null;
          apartment_id: string | null;
          archive: boolean | null;
          copropriete_id: string | null;
          created_at: string;
          created_by: string;
          date_dernier_message: string | null;
          dernier_message: string | null;
          id: string;
          non_lus: number | null;
          participant_id: string | null;
          participant_nom: string;
          participant_type: string | null;
          updated_at: string;
        };
        Insert: {
          actif?: boolean | null;
          apartment_id?: string | null;
          archive?: boolean | null;
          copropriete_id?: string | null;
          created_at?: string;
          created_by?: string;
          date_dernier_message?: string | null;
          dernier_message?: string | null;
          id?: string;
          non_lus?: number | null;
          participant_id?: string | null;
          participant_nom: string;
          participant_type?: string | null;
          updated_at?: string;
        };
        Update: {
          actif?: boolean | null;
          apartment_id?: string | null;
          archive?: boolean | null;
          copropriete_id?: string | null;
          created_at?: string;
          created_by?: string;
          date_dernier_message?: string | null;
          dernier_message?: string | null;
          id?: string;
          non_lus?: number | null;
          participant_id?: string | null;
          participant_nom?: string;
          participant_type?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'chats_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chats_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chats_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
          {
            foreignKeyName: 'chats_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chats_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chats_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'chats_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'chats_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      collective_goals: {
        Row: {
          cible: number;
          copropriete_id: string;
          couleur: string | null;
          created_at: string | null;
          created_by: string | null;
          date_debut: string | null;
          date_limite: string | null;
          description: string | null;
          icone: string | null;
          id: string;
          statut: string | null;
          titre: string;
          unite: string;
          updated_at: string | null;
          valeur_actuelle: number | null;
        };
        Insert: {
          cible: number;
          copropriete_id: string;
          couleur?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          date_debut?: string | null;
          date_limite?: string | null;
          description?: string | null;
          icone?: string | null;
          id?: string;
          statut?: string | null;
          titre: string;
          unite: string;
          updated_at?: string | null;
          valeur_actuelle?: number | null;
        };
        Update: {
          cible?: number;
          copropriete_id?: string;
          couleur?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          date_debut?: string | null;
          date_limite?: string | null;
          description?: string | null;
          icone?: string | null;
          id?: string;
          statut?: string | null;
          titre?: string;
          unite?: string;
          updated_at?: string | null;
          valeur_actuelle?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'collective_goals_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'collective_goals_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'collective_goals_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'collective_goals_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'collective_goals_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      collective_goals_history: {
        Row: {
          cible: number;
          goal_id: string;
          id: string;
          progression: number | null;
          recorded_at: string | null;
          recorded_by: string | null;
          valeur_actuelle: number;
        };
        Insert: {
          cible: number;
          goal_id: string;
          id?: string;
          progression?: number | null;
          recorded_at?: string | null;
          recorded_by?: string | null;
          valeur_actuelle: number;
        };
        Update: {
          cible?: number;
          goal_id?: string;
          id?: string;
          progression?: number | null;
          recorded_at?: string | null;
          recorded_by?: string | null;
          valeur_actuelle?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'collective_goals_history_goal_id_fkey';
            columns: ['goal_id'];
            isOneToOne: false;
            referencedRelation: 'collective_goals';
            referencedColumns: ['id'];
          },
        ];
      };
      compte_rendu: {
        Row: {
          assemblee_id: string;
          conclusion: string | null;
          corps: string | null;
          created_at: string | null;
          created_by: string | null;
          date_envoi: string | null;
          envoye_par: string | null;
          id: string;
          introduction: string | null;
          pdf_url: string | null;
          statut: string | null;
          titre: string;
          updated_at: string | null;
        };
        Insert: {
          assemblee_id: string;
          conclusion?: string | null;
          corps?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          date_envoi?: string | null;
          envoye_par?: string | null;
          id?: string;
          introduction?: string | null;
          pdf_url?: string | null;
          statut?: string | null;
          titre: string;
          updated_at?: string | null;
        };
        Update: {
          assemblee_id?: string;
          conclusion?: string | null;
          corps?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          date_envoi?: string | null;
          envoye_par?: string | null;
          id?: string;
          introduction?: string | null;
          pdf_url?: string | null;
          statut?: string | null;
          titre?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'compte_rendu_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: true;
            referencedRelation: 'assemblees';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'compte_rendu_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: true;
            referencedRelation: 'assemblees_stats';
            referencedColumns: ['id'];
          },
        ];
      };
      compte_rendu_envois: {
        Row: {
          compte_rendu_id: string;
          coproprietaire_id: string;
          created_at: string | null;
          date_envoi: string | null;
          date_ouverture: string | null;
          email: string | null;
          erreur: string | null;
          id: string;
          provider_message_id: string | null;
          statut: string | null;
          updated_at: string | null;
        };
        Insert: {
          compte_rendu_id: string;
          coproprietaire_id: string;
          created_at?: string | null;
          date_envoi?: string | null;
          date_ouverture?: string | null;
          email?: string | null;
          erreur?: string | null;
          id?: string;
          provider_message_id?: string | null;
          statut?: string | null;
          updated_at?: string | null;
        };
        Update: {
          compte_rendu_id?: string;
          coproprietaire_id?: string;
          created_at?: string | null;
          date_envoi?: string | null;
          date_ouverture?: string | null;
          email?: string | null;
          erreur?: string | null;
          id?: string;
          provider_message_id?: string | null;
          statut?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'compte_rendu_envois_compte_rendu_id_fkey';
            columns: ['compte_rendu_id'];
            isOneToOne: false;
            referencedRelation: 'compte_rendu';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'compte_rendu_envois_compte_rendu_id_fkey';
            columns: ['compte_rendu_id'];
            isOneToOne: false;
            referencedRelation: 'compte_rendu_envois_stats';
            referencedColumns: ['compte_rendu_id'];
          },
          {
            foreignKeyName: 'compte_rendu_envois_coproprietaire_id_fkey';
            columns: ['coproprietaire_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietaires';
            referencedColumns: ['id'];
          },
        ];
      };
      convocation_envois: {
        Row: {
          assemblee_id: string;
          coproprietaire_id: string;
          created_at: string | null;
          date_envoi: string | null;
          date_ouverture: string | null;
          email: string | null;
          erreur: string | null;
          id: string;
          provider_message_id: string | null;
          statut: string | null;
          updated_at: string | null;
        };
        Insert: {
          assemblee_id: string;
          coproprietaire_id: string;
          created_at?: string | null;
          date_envoi?: string | null;
          date_ouverture?: string | null;
          email?: string | null;
          erreur?: string | null;
          id?: string;
          provider_message_id?: string | null;
          statut?: string | null;
          updated_at?: string | null;
        };
        Update: {
          assemblee_id?: string;
          coproprietaire_id?: string;
          created_at?: string | null;
          date_envoi?: string | null;
          date_ouverture?: string | null;
          email?: string | null;
          erreur?: string | null;
          id?: string;
          provider_message_id?: string | null;
          statut?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'convocation_envois_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: false;
            referencedRelation: 'assemblees';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'convocation_envois_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: false;
            referencedRelation: 'assemblees_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'convocation_envois_coproprietaire_id_fkey';
            columns: ['coproprietaire_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietaires';
            referencedColumns: ['id'];
          },
        ];
      };
      coproprietaires: {
        Row: {
          adresse_correspondance: string | null;
          copropriete_id: string;
          created_at: string;
          created_by: string;
          dernier_contact: string | null;
          documents_partages: number | null;
          email: string | null;
          fonction_conseil: string | null;
          id: string;
          lots: string[] | null;
          membre_conseil: boolean | null;
          nom: string;
          notes: string | null;
          prelevement_auto: boolean | null;
          prenom: string | null;
          quote_part_charges: number | null;
          rib_bic_encrypted: string | null;
          rib_iban: string | null;
          rib_iban_encrypted: string | null;
          solde_compte: number | null;
          statut_reglement: string | null;
          tantiemes: number | null;
          telephone: string | null;
          updated_at: string;
        };
        Insert: {
          adresse_correspondance?: string | null;
          copropriete_id: string;
          created_at?: string;
          created_by?: string;
          dernier_contact?: string | null;
          documents_partages?: number | null;
          email?: string | null;
          fonction_conseil?: string | null;
          id?: string;
          lots?: string[] | null;
          membre_conseil?: boolean | null;
          nom: string;
          notes?: string | null;
          prelevement_auto?: boolean | null;
          prenom?: string | null;
          quote_part_charges?: number | null;
          rib_bic_encrypted?: string | null;
          rib_iban?: string | null;
          rib_iban_encrypted?: string | null;
          solde_compte?: number | null;
          statut_reglement?: string | null;
          tantiemes?: number | null;
          telephone?: string | null;
          updated_at?: string;
        };
        Update: {
          adresse_correspondance?: string | null;
          copropriete_id?: string;
          created_at?: string;
          created_by?: string;
          dernier_contact?: string | null;
          documents_partages?: number | null;
          email?: string | null;
          fonction_conseil?: string | null;
          id?: string;
          lots?: string[] | null;
          membre_conseil?: boolean | null;
          nom?: string;
          notes?: string | null;
          prelevement_auto?: boolean | null;
          prenom?: string | null;
          quote_part_charges?: number | null;
          rib_bic_encrypted?: string | null;
          rib_iban?: string | null;
          rib_iban_encrypted?: string | null;
          solde_compte?: number | null;
          statut_reglement?: string | null;
          tantiemes?: number | null;
          telephone?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'coproprietaires_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'coproprietaires_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'coproprietaires_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'coproprietaires_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'coproprietaires_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      coproprietes: {
        Row: {
          adresse: string;
          annee_construction: number | null;
          apartments_occupied: number | null;
          budget_annuel_prevu: number | null;
          cabinet_id: string;
          charges_mensuelles_moyennes: number | null;
          code_acces: string | null;
          code_postal: string | null;
          created_at: string;
          created_by: string;
          date_creation_copro: string | null;
          date_fin_exercice: string | null;
          date_reglement_copro: string | null;
          description: string | null;
          energie_chauffage: string | null;
          fiche_synthetique_maj: string | null;
          fond_travaux: number | null;
          has_ascenseur: boolean | null;
          has_digicode: boolean | null;
          has_gardien: boolean | null;
          has_interphone: boolean | null;
          has_videosurveillance: boolean | null;
          id: string;
          image_url: string | null;
          incidents_count: number | null;
          next_ag_date: string | null;
          next_rent_due: string | null;
          nom: string;
          nombre_appartements: number;
          nombre_ascenseurs: number | null;
          nombre_batiments: number | null;
          nombre_caves: number | null;
          nombre_etages: number | null;
          nombre_parkings: number | null;
          num_immat_syndicat_principal: string | null;
          num_immatriculation: string | null;
          pays: string | null;
          personnel_employe: boolean | null;
          reglement_copro_url: string | null;
          residence_services: boolean | null;
          siret: string | null;
          surface_totale: number | null;
          total_revenue: number | null;
          type_chauffage: string | null;
          type_syndicat: string | null;
          updated_at: string;
          ville: string | null;
        };
        Insert: {
          adresse: string;
          annee_construction?: number | null;
          apartments_occupied?: number | null;
          budget_annuel_prevu?: number | null;
          cabinet_id: string;
          charges_mensuelles_moyennes?: number | null;
          code_acces?: string | null;
          code_postal?: string | null;
          created_at?: string;
          created_by?: string;
          date_creation_copro?: string | null;
          date_fin_exercice?: string | null;
          date_reglement_copro?: string | null;
          description?: string | null;
          energie_chauffage?: string | null;
          fiche_synthetique_maj?: string | null;
          fond_travaux?: number | null;
          has_ascenseur?: boolean | null;
          has_digicode?: boolean | null;
          has_gardien?: boolean | null;
          has_interphone?: boolean | null;
          has_videosurveillance?: boolean | null;
          id?: string;
          image_url?: string | null;
          incidents_count?: number | null;
          next_ag_date?: string | null;
          next_rent_due?: string | null;
          nom: string;
          nombre_appartements?: number;
          nombre_ascenseurs?: number | null;
          nombre_batiments?: number | null;
          nombre_caves?: number | null;
          nombre_etages?: number | null;
          nombre_parkings?: number | null;
          num_immat_syndicat_principal?: string | null;
          num_immatriculation?: string | null;
          pays?: string | null;
          personnel_employe?: boolean | null;
          reglement_copro_url?: string | null;
          residence_services?: boolean | null;
          siret?: string | null;
          surface_totale?: number | null;
          total_revenue?: number | null;
          type_chauffage?: string | null;
          type_syndicat?: string | null;
          updated_at?: string;
          ville?: string | null;
        };
        Update: {
          adresse?: string;
          annee_construction?: number | null;
          apartments_occupied?: number | null;
          budget_annuel_prevu?: number | null;
          cabinet_id?: string;
          charges_mensuelles_moyennes?: number | null;
          code_acces?: string | null;
          code_postal?: string | null;
          created_at?: string;
          created_by?: string;
          date_creation_copro?: string | null;
          date_fin_exercice?: string | null;
          date_reglement_copro?: string | null;
          description?: string | null;
          energie_chauffage?: string | null;
          fiche_synthetique_maj?: string | null;
          fond_travaux?: number | null;
          has_ascenseur?: boolean | null;
          has_digicode?: boolean | null;
          has_gardien?: boolean | null;
          has_interphone?: boolean | null;
          has_videosurveillance?: boolean | null;
          id?: string;
          image_url?: string | null;
          incidents_count?: number | null;
          next_ag_date?: string | null;
          next_rent_due?: string | null;
          nom?: string;
          nombre_appartements?: number;
          nombre_ascenseurs?: number | null;
          nombre_batiments?: number | null;
          nombre_caves?: number | null;
          nombre_etages?: number | null;
          nombre_parkings?: number | null;
          num_immat_syndicat_principal?: string | null;
          num_immatriculation?: string | null;
          pays?: string | null;
          personnel_employe?: boolean | null;
          reglement_copro_url?: string | null;
          residence_services?: boolean | null;
          siret?: string | null;
          surface_totale?: number | null;
          total_revenue?: number | null;
          type_chauffage?: string | null;
          type_syndicat?: string | null;
          updated_at?: string;
          ville?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'coproprietes_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
        ];
      };
      cron_job_config: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean | null;
          job_name: string;
          last_run_at: string | null;
          last_run_status: string | null;
          next_run_at: string | null;
          notify_email: string | null;
          notify_on_failure: boolean | null;
          parameters: Json | null;
          schedule: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          job_name: string;
          last_run_at?: string | null;
          last_run_status?: string | null;
          next_run_at?: string | null;
          notify_email?: string | null;
          notify_on_failure?: boolean | null;
          parameters?: Json | null;
          schedule: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          job_name?: string;
          last_run_at?: string | null;
          last_run_status?: string | null;
          next_run_at?: string | null;
          notify_email?: string | null;
          notify_on_failure?: boolean | null;
          parameters?: Json | null;
          schedule?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cron_job_logs: {
        Row: {
          completed_at: string | null;
          created_at: string;
          details: Json | null;
          error_message: string | null;
          id: string;
          job_name: string;
          started_at: string;
          status: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          details?: Json | null;
          error_message?: string | null;
          id?: string;
          job_name: string;
          started_at: string;
          status: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          details?: Json | null;
          error_message?: string | null;
          id?: string;
          job_name?: string;
          started_at?: string;
          status?: string;
        };
        Relationships: [];
      };
      data_retention_policy: {
        Row: {
          action: string;
          created_at: string;
          date_column: string;
          fields_to_anonymize: string[] | null;
          id: string;
          is_active: boolean;
          legal_basis: string | null;
          retention_days: number;
          table_name: string;
          updated_at: string;
        };
        Insert: {
          action?: string;
          created_at?: string;
          date_column?: string;
          fields_to_anonymize?: string[] | null;
          id?: string;
          is_active?: boolean;
          legal_basis?: string | null;
          retention_days: number;
          table_name: string;
          updated_at?: string;
        };
        Update: {
          action?: string;
          created_at?: string;
          date_column?: string;
          fields_to_anonymize?: string[] | null;
          id?: string;
          is_active?: boolean;
          legal_basis?: string | null;
          retention_days?: number;
          table_name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      depot_garantie_restitutions: {
        Row: {
          apartment_id: string;
          bic_restitution: string | null;
          cabinet_id: string;
          commentaire: string | null;
          created_at: string | null;
          created_by: string | null;
          date_edl_sortie: string | null;
          date_entree: string;
          date_limite_restitution: string | null;
          date_restitution_effective: string | null;
          date_sortie: string;
          date_virement: string | null;
          delai_restitution_mois: number | null;
          document_solde_url: string | null;
          edl_conforme: boolean | null;
          iban_restitution: string | null;
          id: string;
          mois_retard: number | null;
          montant_a_restituer: number | null;
          montant_autres_retenues: number | null;
          montant_impayes_charges: number | null;
          montant_impayes_loyers: number | null;
          montant_initial: number;
          montant_provision_charges: number | null;
          montant_reparations: number | null;
          montant_total_retenues: number | null;
          motif_contestation: string | null;
          penalites_retard: number | null;
          reference_virement: string | null;
          statut: string | null;
          tenant_id: string;
          titulaire_compte: string | null;
          updated_at: string | null;
          updated_by: string | null;
          validated_at: string | null;
          validated_by: string | null;
        };
        Insert: {
          apartment_id: string;
          bic_restitution?: string | null;
          cabinet_id: string;
          commentaire?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          date_edl_sortie?: string | null;
          date_entree: string;
          date_limite_restitution?: string | null;
          date_restitution_effective?: string | null;
          date_sortie: string;
          date_virement?: string | null;
          delai_restitution_mois?: number | null;
          document_solde_url?: string | null;
          edl_conforme?: boolean | null;
          iban_restitution?: string | null;
          id?: string;
          mois_retard?: number | null;
          montant_a_restituer?: number | null;
          montant_autres_retenues?: number | null;
          montant_impayes_charges?: number | null;
          montant_impayes_loyers?: number | null;
          montant_initial: number;
          montant_provision_charges?: number | null;
          montant_reparations?: number | null;
          montant_total_retenues?: number | null;
          motif_contestation?: string | null;
          penalites_retard?: number | null;
          reference_virement?: string | null;
          statut?: string | null;
          tenant_id: string;
          titulaire_compte?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
          validated_at?: string | null;
          validated_by?: string | null;
        };
        Update: {
          apartment_id?: string;
          bic_restitution?: string | null;
          cabinet_id?: string;
          commentaire?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          date_edl_sortie?: string | null;
          date_entree?: string;
          date_limite_restitution?: string | null;
          date_restitution_effective?: string | null;
          date_sortie?: string;
          date_virement?: string | null;
          delai_restitution_mois?: number | null;
          document_solde_url?: string | null;
          edl_conforme?: boolean | null;
          iban_restitution?: string | null;
          id?: string;
          mois_retard?: number | null;
          montant_a_restituer?: number | null;
          montant_autres_retenues?: number | null;
          montant_impayes_charges?: number | null;
          montant_impayes_loyers?: number | null;
          montant_initial?: number;
          montant_provision_charges?: number | null;
          montant_reparations?: number | null;
          montant_total_retenues?: number | null;
          motif_contestation?: string | null;
          penalites_retard?: number | null;
          reference_virement?: string | null;
          statut?: string | null;
          tenant_id?: string;
          titulaire_compte?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
          validated_at?: string | null;
          validated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'depot_garantie_restitutions_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'depot_garantie_restitutions_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'depot_garantie_restitutions_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
          {
            foreignKeyName: 'depot_garantie_restitutions_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'depot_garantie_restitutions_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'depot_garantie_restitutions_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['tenant_id'];
          },
          {
            foreignKeyName: 'depot_garantie_restitutions_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['tenant_id'];
          },
        ];
      };
      depot_garantie_retenues: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          date_piece: string | null;
          description: string | null;
          id: string;
          justificatif_type: string | null;
          justificatif_url: string | null;
          libelle: string;
          montant: number;
          numero_piece: string | null;
          restitution_id: string;
          type_retenue: string;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          date_piece?: string | null;
          description?: string | null;
          id?: string;
          justificatif_type?: string | null;
          justificatif_url?: string | null;
          libelle: string;
          montant: number;
          numero_piece?: string | null;
          restitution_id: string;
          type_retenue: string;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          date_piece?: string | null;
          description?: string | null;
          id?: string;
          justificatif_type?: string | null;
          justificatif_url?: string | null;
          libelle?: string;
          montant?: number;
          numero_piece?: string | null;
          restitution_id?: string;
          type_retenue?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'depot_garantie_retenues_restitution_id_fkey';
            columns: ['restitution_id'];
            isOneToOne: false;
            referencedRelation: 'depot_garantie_restitutions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'depot_garantie_retenues_restitution_id_fkey';
            columns: ['restitution_id'];
            isOneToOne: false;
            referencedRelation: 'v_depot_garantie_a_traiter';
            referencedColumns: ['id'];
          },
        ];
      };
      document_access_log: {
        Row: {
          access_reason: string | null;
          access_type: string;
          accessed_at: string;
          accessed_by: string;
          document_id: string;
          document_table: string;
          document_type: string | null;
          id: string;
          ip_address: unknown;
          user_agent: string | null;
        };
        Insert: {
          access_reason?: string | null;
          access_type: string;
          accessed_at?: string;
          accessed_by: string;
          document_id: string;
          document_table: string;
          document_type?: string | null;
          id?: string;
          ip_address?: unknown;
          user_agent?: string | null;
        };
        Update: {
          access_reason?: string | null;
          access_type?: string;
          accessed_at?: string;
          accessed_by?: string;
          document_id?: string;
          document_table?: string;
          document_type?: string | null;
          id?: string;
          ip_address?: unknown;
          user_agent?: string | null;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          apartment_id: string | null;
          assemblee_id: string | null;
          auteur: string | null;
          copropriete_id: string | null;
          created_at: string;
          created_by: string;
          date_document: string | null;
          description: string | null;
          file_name: string | null;
          file_size: number | null;
          file_url: string;
          folder: string | null;
          id: string;
          is_public: boolean | null;
          mime_type: string | null;
          nom: string;
          shared_with: string[] | null;
          subfolder: string | null;
          tags: string[] | null;
          type: string;
          updated_at: string;
          version: number | null;
        };
        Insert: {
          apartment_id?: string | null;
          assemblee_id?: string | null;
          auteur?: string | null;
          copropriete_id?: string | null;
          created_at?: string;
          created_by?: string;
          date_document?: string | null;
          description?: string | null;
          file_name?: string | null;
          file_size?: number | null;
          file_url: string;
          folder?: string | null;
          id?: string;
          is_public?: boolean | null;
          mime_type?: string | null;
          nom: string;
          shared_with?: string[] | null;
          subfolder?: string | null;
          tags?: string[] | null;
          type: string;
          updated_at?: string;
          version?: number | null;
        };
        Update: {
          apartment_id?: string | null;
          assemblee_id?: string | null;
          auteur?: string | null;
          copropriete_id?: string | null;
          created_at?: string;
          created_by?: string;
          date_document?: string | null;
          description?: string | null;
          file_name?: string | null;
          file_size?: number | null;
          file_url?: string;
          folder?: string | null;
          id?: string;
          is_public?: boolean | null;
          mime_type?: string | null;
          nom?: string;
          shared_with?: string[] | null;
          subfolder?: string | null;
          tags?: string[] | null;
          type?: string;
          updated_at?: string;
          version?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'documents_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
          {
            foreignKeyName: 'documents_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: false;
            referencedRelation: 'assemblees';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: false;
            referencedRelation: 'assemblees_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'documents_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'documents_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      email_logs: {
        Row: {
          apartment_id: string | null;
          body_html: string;
          body_text: string | null;
          cabinet_id: string | null;
          clicked_at: string | null;
          created_at: string;
          created_by: string;
          error_message: string | null;
          id: string;
          message_id: string | null;
          opened_at: string | null;
          owner_id: string | null;
          payment_id: string | null;
          recipient_email: string;
          recipient_name: string | null;
          sent_at: string | null;
          status: string;
          subject: string;
          tenant_id: string | null;
          type: string;
          updated_at: string;
        };
        Insert: {
          apartment_id?: string | null;
          body_html: string;
          body_text?: string | null;
          cabinet_id?: string | null;
          clicked_at?: string | null;
          created_at?: string;
          created_by: string;
          error_message?: string | null;
          id?: string;
          message_id?: string | null;
          opened_at?: string | null;
          owner_id?: string | null;
          payment_id?: string | null;
          recipient_email: string;
          recipient_name?: string | null;
          sent_at?: string | null;
          status?: string;
          subject: string;
          tenant_id?: string | null;
          type: string;
          updated_at?: string;
        };
        Update: {
          apartment_id?: string | null;
          body_html?: string;
          body_text?: string | null;
          cabinet_id?: string | null;
          clicked_at?: string | null;
          created_at?: string;
          created_by?: string;
          error_message?: string | null;
          id?: string;
          message_id?: string | null;
          opened_at?: string | null;
          owner_id?: string | null;
          payment_id?: string | null;
          recipient_email?: string;
          recipient_name?: string | null;
          sent_at?: string | null;
          status?: string;
          subject?: string;
          tenant_id?: string | null;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'email_logs_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
        ];
      };
      email_preferences: {
        Row: {
          cgu_version: string | null;
          consent_given_at: string | null;
          consent_history: Json | null;
          consent_ip: unknown;
          consent_source: string | null;
          consent_user_agent: string | null;
          consent_withdrawn_at: string | null;
          created_at: string;
          id: string;
          notification_enabled: boolean | null;
          owner_id: string | null;
          preferred_channel: string | null;
          quittance_enabled: boolean | null;
          relance_enabled: boolean | null;
          sepa_enabled: boolean | null;
          tenant_id: string | null;
          updated_at: string;
        };
        Insert: {
          cgu_version?: string | null;
          consent_given_at?: string | null;
          consent_history?: Json | null;
          consent_ip?: unknown;
          consent_source?: string | null;
          consent_user_agent?: string | null;
          consent_withdrawn_at?: string | null;
          created_at?: string;
          id?: string;
          notification_enabled?: boolean | null;
          owner_id?: string | null;
          preferred_channel?: string | null;
          quittance_enabled?: boolean | null;
          relance_enabled?: boolean | null;
          sepa_enabled?: boolean | null;
          tenant_id?: string | null;
          updated_at?: string;
        };
        Update: {
          cgu_version?: string | null;
          consent_given_at?: string | null;
          consent_history?: Json | null;
          consent_ip?: unknown;
          consent_source?: string | null;
          consent_user_agent?: string | null;
          consent_withdrawn_at?: string | null;
          created_at?: string;
          id?: string;
          notification_enabled?: boolean | null;
          owner_id?: string | null;
          preferred_channel?: string | null;
          quittance_enabled?: boolean | null;
          relance_enabled?: boolean | null;
          sepa_enabled?: boolean | null;
          tenant_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      email_templates: {
        Row: {
          available_variables: Json | null;
          body_template: string;
          code: string;
          created_at: string;
          created_by: string;
          description: string | null;
          email_type: string;
          id: string;
          is_active: boolean | null;
          is_default: boolean | null;
          name: string;
          subject_template: string;
          updated_at: string;
        };
        Insert: {
          available_variables?: Json | null;
          body_template: string;
          code: string;
          created_at?: string;
          created_by: string;
          description?: string | null;
          email_type: string;
          id?: string;
          is_active?: boolean | null;
          is_default?: boolean | null;
          name: string;
          subject_template: string;
          updated_at?: string;
        };
        Update: {
          available_variables?: Json | null;
          body_template?: string;
          code?: string;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          email_type?: string;
          id?: string;
          is_active?: boolean | null;
          is_default?: boolean | null;
          name?: string;
          subject_template?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      error_logs: {
        Row: {
          code: string | null;
          context: Json | null;
          created_at: string;
          error_type: string;
          id: string;
          message: string;
          severity: string;
          stack_trace: string | null;
          status_code: number | null;
          url: string | null;
          user_id: string | null;
          user_message: string;
        };
        Insert: {
          code?: string | null;
          context?: Json | null;
          created_at?: string;
          error_type: string;
          id?: string;
          message: string;
          severity: string;
          stack_trace?: string | null;
          status_code?: number | null;
          url?: string | null;
          user_id?: string | null;
          user_message: string;
        };
        Update: {
          code?: string | null;
          context?: Json | null;
          created_at?: string;
          error_type?: string;
          id?: string;
          message?: string;
          severity?: string;
          stack_trace?: string | null;
          status_code?: number | null;
          url?: string | null;
          user_id?: string | null;
          user_message?: string;
        };
        Relationships: [];
      };
      etats_dates: {
        Row: {
          avances_dues: number | null;
          avances_remboursables: number | null;
          cabinet_id: string;
          coproprietaire_id: string;
          copropriete_id: string;
          created_at: string | null;
          created_by: string | null;
          date_demande: string;
          date_envoi: string | null;
          date_generation: string | null;
          date_limite_reponse: string;
          date_vente_prevue: string | null;
          demandeur_adresse: string | null;
          demandeur_email: string | null;
          demandeur_nom: string;
          demandeur_telephone: string | null;
          demandeur_type: string;
          document_path: string | null;
          document_size: number | null;
          document_url: string | null;
          emprunts_collectifs: string | null;
          facture_generee: boolean | null;
          facture_id: string | null;
          facturer: boolean | null;
          fonds_travaux: number | null;
          frais_recouvrement: number | null;
          id: string;
          impayes: number | null;
          impayes_copropriete: number | null;
          lot_ids: string[];
          montant_facture: number | null;
          observations: string | null;
          procedures_en_cours: string | null;
          provisions_courantes: number | null;
          provisions_non_exigibles: number | null;
          provisions_travaux: number | null;
          quote_part_vente: number | null;
          reference_dossier: string | null;
          solde_final: number | null;
          statut: string;
          total_acquereur: number | null;
          total_du_par_syndicat: number | null;
          total_du_par_vendeur: number | null;
          travaux_decides: string | null;
          travaux_votes_non_appeles: number | null;
          trop_percu_regularisation: number | null;
          type_document: string;
          updated_at: string | null;
        };
        Insert: {
          avances_dues?: number | null;
          avances_remboursables?: number | null;
          cabinet_id: string;
          coproprietaire_id: string;
          copropriete_id: string;
          created_at?: string | null;
          created_by?: string | null;
          date_demande?: string;
          date_envoi?: string | null;
          date_generation?: string | null;
          date_limite_reponse: string;
          date_vente_prevue?: string | null;
          demandeur_adresse?: string | null;
          demandeur_email?: string | null;
          demandeur_nom: string;
          demandeur_telephone?: string | null;
          demandeur_type: string;
          document_path?: string | null;
          document_size?: number | null;
          document_url?: string | null;
          emprunts_collectifs?: string | null;
          facture_generee?: boolean | null;
          facture_id?: string | null;
          facturer?: boolean | null;
          fonds_travaux?: number | null;
          frais_recouvrement?: number | null;
          id?: string;
          impayes?: number | null;
          impayes_copropriete?: number | null;
          lot_ids: string[];
          montant_facture?: number | null;
          observations?: string | null;
          procedures_en_cours?: string | null;
          provisions_courantes?: number | null;
          provisions_non_exigibles?: number | null;
          provisions_travaux?: number | null;
          quote_part_vente?: number | null;
          reference_dossier?: string | null;
          solde_final?: number | null;
          statut?: string;
          total_acquereur?: number | null;
          total_du_par_syndicat?: number | null;
          total_du_par_vendeur?: number | null;
          travaux_decides?: string | null;
          travaux_votes_non_appeles?: number | null;
          trop_percu_regularisation?: number | null;
          type_document: string;
          updated_at?: string | null;
        };
        Update: {
          avances_dues?: number | null;
          avances_remboursables?: number | null;
          cabinet_id?: string;
          coproprietaire_id?: string;
          copropriete_id?: string;
          created_at?: string | null;
          created_by?: string | null;
          date_demande?: string;
          date_envoi?: string | null;
          date_generation?: string | null;
          date_limite_reponse?: string;
          date_vente_prevue?: string | null;
          demandeur_adresse?: string | null;
          demandeur_email?: string | null;
          demandeur_nom?: string;
          demandeur_telephone?: string | null;
          demandeur_type?: string;
          document_path?: string | null;
          document_size?: number | null;
          document_url?: string | null;
          emprunts_collectifs?: string | null;
          facture_generee?: boolean | null;
          facture_id?: string | null;
          facturer?: boolean | null;
          fonds_travaux?: number | null;
          frais_recouvrement?: number | null;
          id?: string;
          impayes?: number | null;
          impayes_copropriete?: number | null;
          lot_ids?: string[];
          montant_facture?: number | null;
          observations?: string | null;
          procedures_en_cours?: string | null;
          provisions_courantes?: number | null;
          provisions_non_exigibles?: number | null;
          provisions_travaux?: number | null;
          quote_part_vente?: number | null;
          reference_dossier?: string | null;
          solde_final?: number | null;
          statut?: string;
          total_acquereur?: number | null;
          total_du_par_syndicat?: number | null;
          total_du_par_vendeur?: number | null;
          travaux_decides?: string | null;
          travaux_votes_non_appeles?: number | null;
          trop_percu_regularisation?: number | null;
          type_document?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'etats_dates_coproprietaire_id_fkey';
            columns: ['coproprietaire_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietaires';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'etats_dates_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'etats_dates_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'etats_dates_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'etats_dates_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'etats_dates_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      etats_dates_history: {
        Row: {
          action: string;
          created_at: string | null;
          created_by: string | null;
          details: Json | null;
          etat_date_id: string;
          id: string;
          new_values: Json | null;
          old_values: Json | null;
        };
        Insert: {
          action: string;
          created_at?: string | null;
          created_by?: string | null;
          details?: Json | null;
          etat_date_id: string;
          id?: string;
          new_values?: Json | null;
          old_values?: Json | null;
        };
        Update: {
          action?: string;
          created_at?: string | null;
          created_by?: string | null;
          details?: Json | null;
          etat_date_id?: string;
          id?: string;
          new_values?: Json | null;
          old_values?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'etats_dates_history_etat_date_id_fkey';
            columns: ['etat_date_id'];
            isOneToOne: false;
            referencedRelation: 'etats_dates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'etats_dates_history_etat_date_id_fkey';
            columns: ['etat_date_id'];
            isOneToOne: false;
            referencedRelation: 'v_etats_dates_dashboard';
            referencedColumns: ['id'];
          },
        ];
      };
      factures: {
        Row: {
          categorie: string | null;
          copropriete_id: string;
          created_at: string;
          created_by: string;
          date_echeance: string | null;
          date_facture: string;
          date_paiement: string | null;
          description: string | null;
          facture_url: string | null;
          fournisseur_adresse: string | null;
          fournisseur_nom: string;
          fournisseur_siret: string | null;
          id: string;
          libelle: string;
          mode_paiement: string | null;
          montant_ht: number | null;
          montant_ttc: number;
          numero_facture: string | null;
          reference_paiement: string | null;
          statut: string | null;
          tva: number | null;
          updated_at: string;
        };
        Insert: {
          categorie?: string | null;
          copropriete_id: string;
          created_at?: string;
          created_by?: string;
          date_echeance?: string | null;
          date_facture: string;
          date_paiement?: string | null;
          description?: string | null;
          facture_url?: string | null;
          fournisseur_adresse?: string | null;
          fournisseur_nom: string;
          fournisseur_siret?: string | null;
          id?: string;
          libelle: string;
          mode_paiement?: string | null;
          montant_ht?: number | null;
          montant_ttc: number;
          numero_facture?: string | null;
          reference_paiement?: string | null;
          statut?: string | null;
          tva?: number | null;
          updated_at?: string;
        };
        Update: {
          categorie?: string | null;
          copropriete_id?: string;
          created_at?: string;
          created_by?: string;
          date_echeance?: string | null;
          date_facture?: string;
          date_paiement?: string | null;
          description?: string | null;
          facture_url?: string | null;
          fournisseur_adresse?: string | null;
          fournisseur_nom?: string;
          fournisseur_siret?: string | null;
          id?: string;
          libelle?: string;
          mode_paiement?: string | null;
          montant_ht?: number | null;
          montant_ttc?: number;
          numero_facture?: string | null;
          reference_paiement?: string | null;
          statut?: string | null;
          tva?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'factures_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'factures_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'factures_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'factures_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'factures_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      garants: {
        Row: {
          adresse: string | null;
          created_at: string | null;
          email: string | null;
          id: string;
          lien_locataire: string | null;
          nom: string | null;
          prenom: string | null;
          revenus_mensuels: number | null;
          telephone: string | null;
          tenant_id: string | null;
          type: string | null;
        };
        Insert: {
          adresse?: string | null;
          created_at?: string | null;
          email?: string | null;
          id: string;
          lien_locataire?: string | null;
          nom?: string | null;
          prenom?: string | null;
          revenus_mensuels?: number | null;
          telephone?: string | null;
          tenant_id?: string | null;
          type?: string | null;
        };
        Update: {
          adresse?: string | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          lien_locataire?: string | null;
          nom?: string | null;
          prenom?: string | null;
          revenus_mensuels?: number | null;
          telephone?: string | null;
          tenant_id?: string | null;
          type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'garants_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'garants_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['tenant_id'];
          },
          {
            foreignKeyName: 'garants_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['tenant_id'];
          },
        ];
      };
      important_dates: {
        Row: {
          copropriete_id: string;
          created_at: string | null;
          date: string;
          description: string;
          id: number;
          type: string;
          updated_at: string | null;
        };
        Insert: {
          copropriete_id: string;
          created_at?: string | null;
          date: string;
          description: string;
          id?: number;
          type: string;
          updated_at?: string | null;
        };
        Update: {
          copropriete_id?: string;
          created_at?: string | null;
          date?: string;
          description?: string;
          id?: number;
          type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'important_dates_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'important_dates_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'important_dates_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'important_dates_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'important_dates_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      incident_history: {
        Row: {
          action: Database['public']['Enums']['incident_action'];
          comment: string | null;
          created_at: string;
          id: string;
          incident_id: string;
          metadata: Json | null;
          new_status: string | null;
          old_status: string | null;
          user_id: string;
        };
        Insert: {
          action: Database['public']['Enums']['incident_action'];
          comment?: string | null;
          created_at?: string;
          id?: string;
          incident_id: string;
          metadata?: Json | null;
          new_status?: string | null;
          old_status?: string | null;
          user_id: string;
        };
        Update: {
          action?: Database['public']['Enums']['incident_action'];
          comment?: string | null;
          created_at?: string;
          id?: string;
          incident_id?: string;
          metadata?: Json | null;
          new_status?: string | null;
          old_status?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'incident_history_incident_id_fkey';
            columns: ['incident_id'];
            isOneToOne: false;
            referencedRelation: 'incidents';
            referencedColumns: ['id'];
          },
        ];
      };
      incidents: {
        Row: {
          apartment_id: string | null;
          cabinet_id: string;
          copropriete_id: string;
          cout_estime: number | null;
          cout_reel: number | null;
          created_at: string;
          created_by: string;
          date_intervention: string | null;
          declarant_email: string | null;
          declarant_nom: string | null;
          declarant_telephone: string | null;
          description: string;
          devis_url: string | null;
          facture_url: string | null;
          id: string;
          intervenant_entreprise: string | null;
          intervenant_nom: string | null;
          intervenant_telephone: string | null;
          notes: string | null;
          photos: string[] | null;
          priorite: string | null;
          reported_date: string | null;
          resolution_summary: string | null;
          resolved_by: string | null;
          resolved_date: string | null;
          status: string | null;
          titre: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          apartment_id?: string | null;
          cabinet_id: string;
          copropriete_id: string;
          cout_estime?: number | null;
          cout_reel?: number | null;
          created_at?: string;
          created_by?: string;
          date_intervention?: string | null;
          declarant_email?: string | null;
          declarant_nom?: string | null;
          declarant_telephone?: string | null;
          description: string;
          devis_url?: string | null;
          facture_url?: string | null;
          id?: string;
          intervenant_entreprise?: string | null;
          intervenant_nom?: string | null;
          intervenant_telephone?: string | null;
          notes?: string | null;
          photos?: string[] | null;
          priorite?: string | null;
          reported_date?: string | null;
          resolution_summary?: string | null;
          resolved_by?: string | null;
          resolved_date?: string | null;
          status?: string | null;
          titre: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          apartment_id?: string | null;
          cabinet_id?: string;
          copropriete_id?: string;
          cout_estime?: number | null;
          cout_reel?: number | null;
          created_at?: string;
          created_by?: string;
          date_intervention?: string | null;
          declarant_email?: string | null;
          declarant_nom?: string | null;
          declarant_telephone?: string | null;
          description?: string;
          devis_url?: string | null;
          facture_url?: string | null;
          id?: string;
          intervenant_entreprise?: string | null;
          intervenant_nom?: string | null;
          intervenant_telephone?: string | null;
          notes?: string | null;
          photos?: string[] | null;
          priorite?: string | null;
          reported_date?: string | null;
          resolution_summary?: string | null;
          resolved_by?: string | null;
          resolved_date?: string | null;
          status?: string | null;
          titre?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'incidents_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'incidents_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'incidents_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
          {
            foreignKeyName: 'incidents_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'incidents_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'incidents_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'incidents_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'incidents_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'incidents_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      irl_values: {
        Row: {
          annee: number;
          created_at: string | null;
          date_publication: string | null;
          id: string;
          source: string | null;
          trimestre: number;
          valeur: number;
        };
        Insert: {
          annee: number;
          created_at?: string | null;
          date_publication?: string | null;
          id?: string;
          source?: string | null;
          trimestre: number;
          valeur: number;
        };
        Update: {
          annee?: number;
          created_at?: string | null;
          date_publication?: string | null;
          id?: string;
          source?: string | null;
          trimestre?: number;
          valeur?: number;
        };
        Relationships: [];
      };
      loyer_revisions: {
        Row: {
          ancien_loyer: number;
          apartment_id: string;
          augmentation: number | null;
          cabinet_id: string;
          commentaire: string | null;
          created_at: string | null;
          created_by: string | null;
          date_anniversaire_bail: string;
          date_application: string | null;
          date_notification: string | null;
          date_revision: string;
          id: string;
          irl_ancien_id: string | null;
          irl_ancien_valeur: number | null;
          irl_nouveau_id: string | null;
          irl_nouveau_valeur: number | null;
          mode_notification: string | null;
          notifiee: boolean | null;
          nouveau_loyer: number;
          pourcentage_augmentation: number | null;
          statut: string | null;
          tenant_id: string;
          updated_at: string | null;
        };
        Insert: {
          ancien_loyer: number;
          apartment_id: string;
          augmentation?: number | null;
          cabinet_id: string;
          commentaire?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          date_anniversaire_bail: string;
          date_application?: string | null;
          date_notification?: string | null;
          date_revision: string;
          id?: string;
          irl_ancien_id?: string | null;
          irl_ancien_valeur?: number | null;
          irl_nouveau_id?: string | null;
          irl_nouveau_valeur?: number | null;
          mode_notification?: string | null;
          notifiee?: boolean | null;
          nouveau_loyer: number;
          pourcentage_augmentation?: number | null;
          statut?: string | null;
          tenant_id: string;
          updated_at?: string | null;
        };
        Update: {
          ancien_loyer?: number;
          apartment_id?: string;
          augmentation?: number | null;
          cabinet_id?: string;
          commentaire?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          date_anniversaire_bail?: string;
          date_application?: string | null;
          date_notification?: string | null;
          date_revision?: string;
          id?: string;
          irl_ancien_id?: string | null;
          irl_ancien_valeur?: number | null;
          irl_nouveau_id?: string | null;
          irl_nouveau_valeur?: number | null;
          mode_notification?: string | null;
          notifiee?: boolean | null;
          nouveau_loyer?: number;
          pourcentage_augmentation?: number | null;
          statut?: string | null;
          tenant_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'loyer_revisions_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'loyer_revisions_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'loyer_revisions_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
          {
            foreignKeyName: 'loyer_revisions_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'loyer_revisions_irl_ancien_id_fkey';
            columns: ['irl_ancien_id'];
            isOneToOne: false;
            referencedRelation: 'irl_values';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'loyer_revisions_irl_nouveau_id_fkey';
            columns: ['irl_nouveau_id'];
            isOneToOne: false;
            referencedRelation: 'irl_values';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'loyer_revisions_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'loyer_revisions_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['tenant_id'];
          },
          {
            foreignKeyName: 'loyer_revisions_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['tenant_id'];
          },
        ];
      };
      monitoring_alerts: {
        Row: {
          created_at: string;
          description: string | null;
          error_type: string | null;
          id: string;
          is_active: boolean | null;
          last_triggered_at: string | null;
          name: string;
          notify_email: string | null;
          notify_slack_webhook: string | null;
          severity: string | null;
          threshold: number;
          time_window_minutes: number;
          trigger_count: number | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          error_type?: string | null;
          id?: string;
          is_active?: boolean | null;
          last_triggered_at?: string | null;
          name: string;
          notify_email?: string | null;
          notify_slack_webhook?: string | null;
          severity?: string | null;
          threshold?: number;
          time_window_minutes?: number;
          trigger_count?: number | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          error_type?: string | null;
          id?: string;
          is_active?: boolean | null;
          last_triggered_at?: string | null;
          name?: string;
          notify_email?: string | null;
          notify_slack_webhook?: string | null;
          severity?: string | null;
          threshold?: number;
          time_window_minutes?: number;
          trigger_count?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      notes_ag: {
        Row: {
          assemblee_id: string;
          auteur_id: string | null;
          categorie: string | null;
          contenu: string;
          created_at: string | null;
          heure_note: string | null;
          id: string;
          resolution_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          assemblee_id: string;
          auteur_id?: string | null;
          categorie?: string | null;
          contenu: string;
          created_at?: string | null;
          heure_note?: string | null;
          id?: string;
          resolution_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          assemblee_id?: string;
          auteur_id?: string | null;
          categorie?: string | null;
          contenu?: string;
          created_at?: string | null;
          heure_note?: string | null;
          id?: string;
          resolution_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notes_ag_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: false;
            referencedRelation: 'assemblees';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notes_ag_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: false;
            referencedRelation: 'assemblees_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notes_ag_resolution_id_fkey';
            columns: ['resolution_id'];
            isOneToOne: false;
            referencedRelation: 'resolutions';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          apartment_id: string | null;
          cabinet_id: string | null;
          copropriete_id: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          incident_id: string | null;
          is_read: boolean | null;
          metadata: Json | null;
          payment_id: string | null;
          read_at: string | null;
          redirect_to: string | null;
          tenant_id: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          apartment_id?: string | null;
          cabinet_id?: string | null;
          copropriete_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          incident_id?: string | null;
          is_read?: boolean | null;
          metadata?: Json | null;
          payment_id?: string | null;
          read_at?: string | null;
          redirect_to?: string | null;
          tenant_id?: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Update: {
          apartment_id?: string | null;
          cabinet_id?: string | null;
          copropriete_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          incident_id?: string | null;
          is_read?: boolean | null;
          metadata?: Json | null;
          payment_id?: string | null;
          read_at?: string | null;
          redirect_to?: string | null;
          tenant_id?: string | null;
          title?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
        ];
      };
      owner_apartments: {
        Row: {
          apartment_id: string;
          created_at: string;
          date_acquisition: string | null;
          date_cession: string | null;
          date_debut_mandat: string | null;
          date_fin_mandat: string | null;
          id: string;
          mandat_gestion: boolean;
          montant_honoraires: number | null;
          notes: string | null;
          owner_id: string;
          quote_part_copro: number | null;
          quote_part_propriete: number;
          type_honoraires: Database['public']['Enums']['type_honoraires'] | null;
          updated_at: string;
        };
        Insert: {
          apartment_id: string;
          created_at?: string;
          date_acquisition?: string | null;
          date_cession?: string | null;
          date_debut_mandat?: string | null;
          date_fin_mandat?: string | null;
          id?: string;
          mandat_gestion?: boolean;
          montant_honoraires?: number | null;
          notes?: string | null;
          owner_id: string;
          quote_part_copro?: number | null;
          quote_part_propriete?: number;
          type_honoraires?: Database['public']['Enums']['type_honoraires'] | null;
          updated_at?: string;
        };
        Update: {
          apartment_id?: string;
          created_at?: string;
          date_acquisition?: string | null;
          date_cession?: string | null;
          date_debut_mandat?: string | null;
          date_fin_mandat?: string | null;
          id?: string;
          mandat_gestion?: boolean;
          montant_honoraires?: number | null;
          notes?: string | null;
          owner_id?: string;
          quote_part_copro?: number | null;
          quote_part_propriete?: number;
          type_honoraires?: Database['public']['Enums']['type_honoraires'] | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'owner_apartments_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'owner_apartments_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'owner_apartments_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
          {
            foreignKeyName: 'owner_apartments_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'owner_apartments_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['owner_id'];
          },
          {
            foreignKeyName: 'owner_apartments_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'v_owners_with_apartments';
            referencedColumns: ['id'];
          },
        ];
      };
      owner_bank_accounts: {
        Row: {
          bic: string | null;
          bic_encrypted: string | null;
          created_at: string;
          iban: string;
          iban_encrypted: string | null;
          id: string;
          is_default: boolean;
          label: string;
          owner_id: string;
          titulaire_compte: string;
          updated_at: string;
        };
        Insert: {
          bic?: string | null;
          bic_encrypted?: string | null;
          created_at?: string;
          iban: string;
          iban_encrypted?: string | null;
          id?: string;
          is_default?: boolean;
          label?: string;
          owner_id: string;
          titulaire_compte: string;
          updated_at?: string;
        };
        Update: {
          bic?: string | null;
          bic_encrypted?: string | null;
          created_at?: string;
          iban?: string;
          iban_encrypted?: string | null;
          id?: string;
          is_default?: boolean;
          label?: string;
          owner_id?: string;
          titulaire_compte?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'owner_bank_accounts_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'owner_bank_accounts_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['owner_id'];
          },
          {
            foreignKeyName: 'owner_bank_accounts_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'v_owners_with_apartments';
            referencedColumns: ['id'];
          },
        ];
      };
      owner_documents: {
        Row: {
          annee: number | null;
          apartment_id: string | null;
          description: string | null;
          file_name: string;
          file_path: string;
          file_size: number | null;
          id: string;
          mime_type: string | null;
          owner_id: string;
          type: Database['public']['Enums']['owner_document_type'];
          uploaded_at: string;
          uploaded_by: string | null;
        };
        Insert: {
          annee?: number | null;
          apartment_id?: string | null;
          description?: string | null;
          file_name: string;
          file_path: string;
          file_size?: number | null;
          id?: string;
          mime_type?: string | null;
          owner_id: string;
          type: Database['public']['Enums']['owner_document_type'];
          uploaded_at?: string;
          uploaded_by?: string | null;
        };
        Update: {
          annee?: number | null;
          apartment_id?: string | null;
          description?: string | null;
          file_name?: string;
          file_path?: string;
          file_size?: number | null;
          id?: string;
          mime_type?: string | null;
          owner_id?: string;
          type?: Database['public']['Enums']['owner_document_type'];
          uploaded_at?: string;
          uploaded_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'owner_documents_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'owner_documents_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'owner_documents_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
          {
            foreignKeyName: 'owner_documents_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'owner_documents_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['owner_id'];
          },
          {
            foreignKeyName: 'owner_documents_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'v_owners_with_apartments';
            referencedColumns: ['id'];
          },
        ];
      };
      owners: {
        Row: {
          adresse: string | null;
          cabinet_id: string | null;
          civilite: string | null;
          code_postal: string | null;
          created_at: string;
          created_by: string | null;
          date_naissance: string | null;
          email: string | null;
          id: string;
          lieu_naissance: string | null;
          nom: string;
          notes: string | null;
          numero_fiscal: string | null;
          pays: string | null;
          prenom: string | null;
          regime_fiscal: Database['public']['Enums']['regime_fiscal'] | null;
          statut: Database['public']['Enums']['owner_status'];
          telephone: string | null;
          type: Database['public']['Enums']['owner_type'];
          updated_at: string;
          ville: string | null;
        };
        Insert: {
          adresse?: string | null;
          cabinet_id?: string | null;
          civilite?: string | null;
          code_postal?: string | null;
          created_at?: string;
          created_by?: string | null;
          date_naissance?: string | null;
          email?: string | null;
          id?: string;
          lieu_naissance?: string | null;
          nom: string;
          notes?: string | null;
          numero_fiscal?: string | null;
          pays?: string | null;
          prenom?: string | null;
          regime_fiscal?: Database['public']['Enums']['regime_fiscal'] | null;
          statut?: Database['public']['Enums']['owner_status'];
          telephone?: string | null;
          type?: Database['public']['Enums']['owner_type'];
          updated_at?: string;
          ville?: string | null;
        };
        Update: {
          adresse?: string | null;
          cabinet_id?: string | null;
          civilite?: string | null;
          code_postal?: string | null;
          created_at?: string;
          created_by?: string | null;
          date_naissance?: string | null;
          email?: string | null;
          id?: string;
          lieu_naissance?: string | null;
          nom?: string;
          notes?: string | null;
          numero_fiscal?: string | null;
          pays?: string | null;
          prenom?: string | null;
          regime_fiscal?: Database['public']['Enums']['regime_fiscal'] | null;
          statut?: Database['public']['Enums']['owner_status'];
          telephone?: string | null;
          type?: Database['public']['Enums']['owner_type'];
          updated_at?: string;
          ville?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'owners_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
        ];
      };
      parking_spaces: {
        Row: {
          apartment_id: string | null;
          copropriete_id: string;
          created_at: string;
          created_by: string;
          date_debut_location: string | null;
          date_fin_location: string | null;
          id: string;
          locataire_nom: string | null;
          loyer_mensuel: number | null;
          niveau: string | null;
          numero: string;
          proprietaire_nom: string | null;
          status: string | null;
          type_place: string | null;
          type_propriete: string | null;
          updated_at: string;
        };
        Insert: {
          apartment_id?: string | null;
          copropriete_id: string;
          created_at?: string;
          created_by?: string;
          date_debut_location?: string | null;
          date_fin_location?: string | null;
          id?: string;
          locataire_nom?: string | null;
          loyer_mensuel?: number | null;
          niveau?: string | null;
          numero: string;
          proprietaire_nom?: string | null;
          status?: string | null;
          type_place?: string | null;
          type_propriete?: string | null;
          updated_at?: string;
        };
        Update: {
          apartment_id?: string | null;
          copropriete_id?: string;
          created_at?: string;
          created_by?: string;
          date_debut_location?: string | null;
          date_fin_location?: string | null;
          id?: string;
          locataire_nom?: string | null;
          loyer_mensuel?: number | null;
          niveau?: string | null;
          numero?: string;
          proprietaire_nom?: string | null;
          status?: string | null;
          type_place?: string | null;
          type_propriete?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'parking_spaces_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'parking_spaces_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'parking_spaces_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
          {
            foreignKeyName: 'parking_spaces_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'parking_spaces_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'parking_spaces_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'parking_spaces_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'parking_spaces_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      payment_schedules: {
        Row: {
          actif: boolean;
          apartment_id: string;
          bic: string | null;
          bic_encrypted: string | null;
          cabinet_id: string;
          copropriete_id: string;
          created_at: string;
          created_by: string;
          date_debut: string;
          date_fin: string | null;
          iban: string | null;
          iban_encrypted: string | null;
          id: string;
          jour_prelevement: number;
          mandat_sepa_date: string | null;
          mandat_sepa_reference: string | null;
          mode_paiement: Database['public']['Enums']['rent_payment_method'] | null;
          montant_charges: number;
          montant_loyer: number;
          tenant_id: string | null;
          titulaire_compte: string | null;
          updated_at: string;
        };
        Insert: {
          actif?: boolean;
          apartment_id: string;
          bic?: string | null;
          bic_encrypted?: string | null;
          cabinet_id: string;
          copropriete_id: string;
          created_at?: string;
          created_by: string;
          date_debut: string;
          date_fin?: string | null;
          iban?: string | null;
          iban_encrypted?: string | null;
          id?: string;
          jour_prelevement?: number;
          mandat_sepa_date?: string | null;
          mandat_sepa_reference?: string | null;
          mode_paiement?: Database['public']['Enums']['rent_payment_method'] | null;
          montant_charges?: number;
          montant_loyer: number;
          tenant_id?: string | null;
          titulaire_compte?: string | null;
          updated_at?: string;
        };
        Update: {
          actif?: boolean;
          apartment_id?: string;
          bic?: string | null;
          bic_encrypted?: string | null;
          cabinet_id?: string;
          copropriete_id?: string;
          created_at?: string;
          created_by?: string;
          date_debut?: string;
          date_fin?: string | null;
          iban?: string | null;
          iban_encrypted?: string | null;
          id?: string;
          jour_prelevement?: number;
          mandat_sepa_date?: string | null;
          mandat_sepa_reference?: string | null;
          mode_paiement?: Database['public']['Enums']['rent_payment_method'] | null;
          montant_charges?: number;
          montant_loyer?: number;
          tenant_id?: string | null;
          titulaire_compte?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'payment_schedules_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payment_schedules_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payment_schedules_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
          {
            foreignKeyName: 'payment_schedules_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payment_schedules_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payment_schedules_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payment_schedules_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'payment_schedules_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'payment_schedules_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'payment_schedules_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payment_schedules_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['tenant_id'];
          },
          {
            foreignKeyName: 'payment_schedules_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['tenant_id'];
          },
        ];
      };
      performance_logs: {
        Row: {
          created_at: string;
          details: Json | null;
          duration_ms: number;
          id: string;
          metric_name: string;
          metric_type: string;
          success: boolean | null;
          url: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          details?: Json | null;
          duration_ms: number;
          id?: string;
          metric_name: string;
          metric_type: string;
          success?: boolean | null;
          url?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          details?: Json | null;
          duration_ms?: number;
          id?: string;
          metric_name?: string;
          metric_type?: string;
          success?: boolean | null;
          url?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      plan_travaux_historique: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          date_version: string | null;
          description_modification: string | null;
          id: string;
          plan_travaux_id: string;
          snapshot_budget: Json | null;
          snapshot_items: Json | null;
          type_modification: string | null;
          version_numero: number;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          date_version?: string | null;
          description_modification?: string | null;
          id?: string;
          plan_travaux_id: string;
          snapshot_budget?: Json | null;
          snapshot_items?: Json | null;
          type_modification?: string | null;
          version_numero: number;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          date_version?: string | null;
          description_modification?: string | null;
          id?: string;
          plan_travaux_id?: string;
          snapshot_budget?: Json | null;
          snapshot_items?: Json | null;
          type_modification?: string | null;
          version_numero?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'plan_travaux_historique_plan_travaux_id_fkey';
            columns: ['plan_travaux_id'];
            isOneToOne: false;
            referencedRelation: 'plans_travaux';
            referencedColumns: ['id'];
          },
        ];
      };
      plan_travaux_items: {
        Row: {
          annee_prevue: number;
          annee_report: number | null;
          categorie: string | null;
          condition_declenchement: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          justification: string | null;
          libelle: string;
          montant_estime: number | null;
          montant_reel: number | null;
          motif_report: string | null;
          ordre_dans_annee: number | null;
          plan_travaux_id: string;
          priorite: string | null;
          source_financement: string | null;
          statut: string | null;
          travaux_id: string | null;
          trimestre_prevu: number | null;
          updated_at: string | null;
        };
        Insert: {
          annee_prevue: number;
          annee_report?: number | null;
          categorie?: string | null;
          condition_declenchement?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          justification?: string | null;
          libelle: string;
          montant_estime?: number | null;
          montant_reel?: number | null;
          motif_report?: string | null;
          ordre_dans_annee?: number | null;
          plan_travaux_id: string;
          priorite?: string | null;
          source_financement?: string | null;
          statut?: string | null;
          travaux_id?: string | null;
          trimestre_prevu?: number | null;
          updated_at?: string | null;
        };
        Update: {
          annee_prevue?: number;
          annee_report?: number | null;
          categorie?: string | null;
          condition_declenchement?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          justification?: string | null;
          libelle?: string;
          montant_estime?: number | null;
          montant_reel?: number | null;
          motif_report?: string | null;
          ordre_dans_annee?: number | null;
          plan_travaux_id?: string;
          priorite?: string | null;
          source_financement?: string | null;
          statut?: string | null;
          travaux_id?: string | null;
          trimestre_prevu?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'plan_travaux_items_plan_travaux_id_fkey';
            columns: ['plan_travaux_id'];
            isOneToOne: false;
            referencedRelation: 'plans_travaux';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plan_travaux_items_travaux_id_fkey';
            columns: ['travaux_id'];
            isOneToOne: false;
            referencedRelation: 'travaux';
            referencedColumns: ['id'];
          },
        ];
      };
      plans_travaux: {
        Row: {
          ag_vote_id: string | null;
          budget_appels_exceptionnels: number | null;
          budget_fonds_travaux_alloue: number | null;
          budget_total_estime: number | null;
          cabinet_id: string;
          copropriete_id: string;
          created_at: string | null;
          created_by: string | null;
          date_debut: string;
          date_fin: string;
          date_vote_ag: string | null;
          description: string | null;
          dtg_date: string | null;
          dtg_prestataire: string | null;
          dtg_realise: boolean | null;
          dtg_url: string | null;
          duree_annees: number | null;
          id: string;
          nom: string;
          resolution_ag: string | null;
          statut: string | null;
          updated_at: string | null;
          updated_by: string | null;
          version: number | null;
        };
        Insert: {
          ag_vote_id?: string | null;
          budget_appels_exceptionnels?: number | null;
          budget_fonds_travaux_alloue?: number | null;
          budget_total_estime?: number | null;
          cabinet_id: string;
          copropriete_id: string;
          created_at?: string | null;
          created_by?: string | null;
          date_debut: string;
          date_fin: string;
          date_vote_ag?: string | null;
          description?: string | null;
          dtg_date?: string | null;
          dtg_prestataire?: string | null;
          dtg_realise?: boolean | null;
          dtg_url?: string | null;
          duree_annees?: number | null;
          id?: string;
          nom: string;
          resolution_ag?: string | null;
          statut?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
          version?: number | null;
        };
        Update: {
          ag_vote_id?: string | null;
          budget_appels_exceptionnels?: number | null;
          budget_fonds_travaux_alloue?: number | null;
          budget_total_estime?: number | null;
          cabinet_id?: string;
          copropriete_id?: string;
          created_at?: string | null;
          created_by?: string | null;
          date_debut?: string;
          date_fin?: string;
          date_vote_ag?: string | null;
          description?: string | null;
          dtg_date?: string | null;
          dtg_prestataire?: string | null;
          dtg_realise?: boolean | null;
          dtg_url?: string | null;
          duree_annees?: number | null;
          id?: string;
          nom?: string;
          resolution_ag?: string | null;
          statut?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
          version?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'plans_travaux_ag_vote_id_fkey';
            columns: ['ag_vote_id'];
            isOneToOne: false;
            referencedRelation: 'assemblees';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plans_travaux_ag_vote_id_fkey';
            columns: ['ag_vote_id'];
            isOneToOne: false;
            referencedRelation: 'assemblees_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plans_travaux_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plans_travaux_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plans_travaux_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plans_travaux_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'plans_travaux_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'plans_travaux_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      presences: {
        Row: {
          assemblee_id: string;
          coproprietaire_id: string;
          created_at: string | null;
          heure_arrivee: string | null;
          heure_depart: string | null;
          id: string;
          notes: string | null;
          signature_url: string | null;
          tantiemes: number;
          type: string | null;
          updated_at: string | null;
        };
        Insert: {
          assemblee_id: string;
          coproprietaire_id: string;
          created_at?: string | null;
          heure_arrivee?: string | null;
          heure_depart?: string | null;
          id?: string;
          notes?: string | null;
          signature_url?: string | null;
          tantiemes?: number;
          type?: string | null;
          updated_at?: string | null;
        };
        Update: {
          assemblee_id?: string;
          coproprietaire_id?: string;
          created_at?: string | null;
          heure_arrivee?: string | null;
          heure_depart?: string | null;
          id?: string;
          notes?: string | null;
          signature_url?: string | null;
          tantiemes?: number;
          type?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'presences_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: false;
            referencedRelation: 'assemblees';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'presences_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: false;
            referencedRelation: 'assemblees_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'presences_coproprietaire_id_fkey';
            columns: ['coproprietaire_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietaires';
            referencedColumns: ['id'];
          },
        ];
      };
      procurations: {
        Row: {
          assemblee_id: string;
          created_at: string | null;
          date_reception: string | null;
          document_url: string | null;
          id: string;
          mandant_id: string;
          mandataire_id: string;
          tantiemes_delegues: number;
          updated_at: string | null;
          validee: boolean | null;
        };
        Insert: {
          assemblee_id: string;
          created_at?: string | null;
          date_reception?: string | null;
          document_url?: string | null;
          id?: string;
          mandant_id: string;
          mandataire_id: string;
          tantiemes_delegues?: number;
          updated_at?: string | null;
          validee?: boolean | null;
        };
        Update: {
          assemblee_id?: string;
          created_at?: string | null;
          date_reception?: string | null;
          document_url?: string | null;
          id?: string;
          mandant_id?: string;
          mandataire_id?: string;
          tantiemes_delegues?: number;
          updated_at?: string | null;
          validee?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'procurations_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: false;
            referencedRelation: 'assemblees';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'procurations_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: false;
            referencedRelation: 'assemblees_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'procurations_mandant_id_fkey';
            columns: ['mandant_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietaires';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'procurations_mandataire_id_fkey';
            columns: ['mandataire_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietaires';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          favorite_coproprietes: string[] | null;
          first_name: string | null;
          id: string;
          last_login: string | null;
          last_name: string | null;
          phone: string | null;
          preferences: Json | null;
          role: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          favorite_coproprietes?: string[] | null;
          first_name?: string | null;
          id: string;
          last_login?: string | null;
          last_name?: string | null;
          phone?: string | null;
          preferences?: Json | null;
          role?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          favorite_coproprietes?: string[] | null;
          first_name?: string | null;
          id?: string;
          last_login?: string | null;
          last_name?: string | null;
          phone?: string | null;
          preferences?: Json | null;
          role?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      quittances: {
        Row: {
          bailleur_adresse: string | null;
          bailleur_nom: string;
          bien_adresse: string;
          bien_description: string | null;
          cabinet_id: string | null;
          created_at: string;
          created_by: string;
          date_envoi: string | null;
          date_paiement: string;
          email_envoi: string | null;
          id: string;
          locataire_adresse: string | null;
          locataire_nom: string;
          mode_paiement: string | null;
          montant_charges: number;
          montant_loyer: number;
          montant_total: number;
          numero: string;
          payment_id: string;
          pdf_storage_path: string | null;
          pdf_url: string | null;
          periode_debut: string;
          periode_fin: string;
          status: Database['public']['Enums']['quittance_status'];
          updated_at: string;
        };
        Insert: {
          bailleur_adresse?: string | null;
          bailleur_nom: string;
          bien_adresse: string;
          bien_description?: string | null;
          cabinet_id?: string | null;
          created_at?: string;
          created_by: string;
          date_envoi?: string | null;
          date_paiement: string;
          email_envoi?: string | null;
          id?: string;
          locataire_adresse?: string | null;
          locataire_nom: string;
          mode_paiement?: string | null;
          montant_charges: number;
          montant_loyer: number;
          montant_total: number;
          numero: string;
          payment_id: string;
          pdf_storage_path?: string | null;
          pdf_url?: string | null;
          periode_debut: string;
          periode_fin: string;
          status?: Database['public']['Enums']['quittance_status'];
          updated_at?: string;
        };
        Update: {
          bailleur_adresse?: string | null;
          bailleur_nom?: string;
          bien_adresse?: string;
          bien_description?: string | null;
          cabinet_id?: string | null;
          created_at?: string;
          created_by?: string;
          date_envoi?: string | null;
          date_paiement?: string;
          email_envoi?: string | null;
          id?: string;
          locataire_adresse?: string | null;
          locataire_nom?: string;
          mode_paiement?: string | null;
          montant_charges?: number;
          montant_loyer?: number;
          montant_total?: number;
          numero?: string;
          payment_id?: string;
          pdf_storage_path?: string | null;
          pdf_url?: string | null;
          periode_debut?: string;
          periode_fin?: string;
          status?: Database['public']['Enums']['quittance_status'];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quittances_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'quittances_payment_id_fkey';
            columns: ['payment_id'];
            isOneToOne: false;
            referencedRelation: 'rent_payments';
            referencedColumns: ['id'];
          },
        ];
      };
      rent_payments: {
        Row: {
          apartment_id: string;
          cabinet_id: string;
          copropriete_id: string;
          created_at: string;
          created_by: string;
          date_echeance: string;
          date_paiement: string | null;
          derniere_relance: string | null;
          historique_relances: Json | null;
          id: string;
          jours_retard: number | null;
          montant_charges: number;
          montant_loyer: number;
          montant_paye: number;
          montant_total: number | null;
          nombre_relances: number | null;
          notes: string | null;
          payment_method: Database['public']['Enums']['rent_payment_method'] | null;
          periode_debut: string;
          periode_fin: string;
          reference_paiement: string | null;
          reste_a_payer: number | null;
          status: Database['public']['Enums']['rent_payment_status'];
          tenant_id: string | null;
          updated_at: string;
        };
        Insert: {
          apartment_id: string;
          cabinet_id: string;
          copropriete_id: string;
          created_at?: string;
          created_by: string;
          date_echeance: string;
          date_paiement?: string | null;
          derniere_relance?: string | null;
          historique_relances?: Json | null;
          id?: string;
          jours_retard?: number | null;
          montant_charges?: number;
          montant_loyer?: number;
          montant_paye?: number;
          montant_total?: number | null;
          nombre_relances?: number | null;
          notes?: string | null;
          payment_method?: Database['public']['Enums']['rent_payment_method'] | null;
          periode_debut: string;
          periode_fin: string;
          reference_paiement?: string | null;
          reste_a_payer?: number | null;
          status?: Database['public']['Enums']['rent_payment_status'];
          tenant_id?: string | null;
          updated_at?: string;
        };
        Update: {
          apartment_id?: string;
          cabinet_id?: string;
          copropriete_id?: string;
          created_at?: string;
          created_by?: string;
          date_echeance?: string;
          date_paiement?: string | null;
          derniere_relance?: string | null;
          historique_relances?: Json | null;
          id?: string;
          jours_retard?: number | null;
          montant_charges?: number;
          montant_loyer?: number;
          montant_paye?: number;
          montant_total?: number | null;
          nombre_relances?: number | null;
          notes?: string | null;
          payment_method?: Database['public']['Enums']['rent_payment_method'] | null;
          periode_debut?: string;
          periode_fin?: string;
          reference_paiement?: string | null;
          reste_a_payer?: number | null;
          status?: Database['public']['Enums']['rent_payment_status'];
          tenant_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'rent_payments_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rent_payments_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rent_payments_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
          {
            foreignKeyName: 'rent_payments_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rent_payments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rent_payments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rent_payments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'rent_payments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'rent_payments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'rent_payments_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rent_payments_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['tenant_id'];
          },
          {
            foreignKeyName: 'rent_payments_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['tenant_id'];
          },
        ];
      };
      rent_receipts: {
        Row: {
          apartment_id: string;
          charges: number | null;
          created_at: string;
          created_by: string;
          date_envoi: string | null;
          date_paiement: string | null;
          envoyee: boolean | null;
          id: string;
          loyer: number;
          mode_paiement: string | null;
          mois: string;
          quittance_url: string | null;
          reference_paiement: string | null;
          tenant_id: string | null;
          total: number | null;
        };
        Insert: {
          apartment_id: string;
          charges?: number | null;
          created_at?: string;
          created_by?: string;
          date_envoi?: string | null;
          date_paiement?: string | null;
          envoyee?: boolean | null;
          id?: string;
          loyer: number;
          mode_paiement?: string | null;
          mois: string;
          quittance_url?: string | null;
          reference_paiement?: string | null;
          tenant_id?: string | null;
          total?: number | null;
        };
        Update: {
          apartment_id?: string;
          charges?: number | null;
          created_at?: string;
          created_by?: string;
          date_envoi?: string | null;
          date_paiement?: string | null;
          envoyee?: boolean | null;
          id?: string;
          loyer?: number;
          mode_paiement?: string | null;
          mois?: string;
          quittance_url?: string | null;
          reference_paiement?: string | null;
          tenant_id?: string | null;
          total?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'rent_receipts_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rent_receipts_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rent_receipts_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
        ];
      };
      resolutions: {
        Row: {
          abstentions: number | null;
          assemblee_id: string;
          created_at: string | null;
          description: string | null;
          id: string;
          majorite_requise: string | null;
          numero: number;
          resultat: string | null;
          tantiemes_contre: number | null;
          tantiemes_pour: number | null;
          titre: string;
          updated_at: string | null;
          votes_contre: number | null;
          votes_pour: number | null;
        };
        Insert: {
          abstentions?: number | null;
          assemblee_id: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          majorite_requise?: string | null;
          numero: number;
          resultat?: string | null;
          tantiemes_contre?: number | null;
          tantiemes_pour?: number | null;
          titre: string;
          updated_at?: string | null;
          votes_contre?: number | null;
          votes_pour?: number | null;
        };
        Update: {
          abstentions?: number | null;
          assemblee_id?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          majorite_requise?: string | null;
          numero?: number;
          resultat?: string | null;
          tantiemes_contre?: number | null;
          tantiemes_pour?: number | null;
          titre?: string;
          updated_at?: string | null;
          votes_contre?: number | null;
          votes_pour?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'resolutions_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: false;
            referencedRelation: 'assemblees';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'resolutions_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: false;
            referencedRelation: 'assemblees_stats';
            referencedColumns: ['id'];
          },
        ];
      };
      rgpd_audit_log: {
        Row: {
          action: string;
          created_at: string;
          details: Json | null;
          id: string;
          ip_address: string | null;
          performed_at: string;
          performed_by: string | null;
          reason: string | null;
          subject_id: string;
          subject_type: string;
          user_agent: string | null;
        };
        Insert: {
          action: string;
          created_at?: string;
          details?: Json | null;
          id?: string;
          ip_address?: string | null;
          performed_at?: string;
          performed_by?: string | null;
          reason?: string | null;
          subject_id: string;
          subject_type: string;
          user_agent?: string | null;
        };
        Update: {
          action?: string;
          created_at?: string;
          details?: Json | null;
          id?: string;
          ip_address?: string | null;
          performed_at?: string;
          performed_by?: string | null;
          reason?: string | null;
          subject_id?: string;
          subject_type?: string;
          user_agent?: string | null;
        };
        Relationships: [];
      };
      syndic_branding: {
        Row: {
          adresse: string | null;
          cabinet_id: string | null;
          code_postal: string | null;
          couleur_primaire: string | null;
          couleur_secondaire: string | null;
          created_at: string | null;
          created_by: string | null;
          email_contact: string | null;
          id: string;
          is_active: boolean | null;
          logo_small_url: string | null;
          logo_url: string | null;
          mention_legale: string | null;
          nom_societe: string;
          signature_url: string | null;
          siret: string | null;
          site_web: string | null;
          slogan: string | null;
          tampon_url: string | null;
          telephone: string | null;
          updated_at: string | null;
          ville: string | null;
        };
        Insert: {
          adresse?: string | null;
          cabinet_id?: string | null;
          code_postal?: string | null;
          couleur_primaire?: string | null;
          couleur_secondaire?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          email_contact?: string | null;
          id?: string;
          is_active?: boolean | null;
          logo_small_url?: string | null;
          logo_url?: string | null;
          mention_legale?: string | null;
          nom_societe: string;
          signature_url?: string | null;
          siret?: string | null;
          site_web?: string | null;
          slogan?: string | null;
          tampon_url?: string | null;
          telephone?: string | null;
          updated_at?: string | null;
          ville?: string | null;
        };
        Update: {
          adresse?: string | null;
          cabinet_id?: string | null;
          code_postal?: string | null;
          couleur_primaire?: string | null;
          couleur_secondaire?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          email_contact?: string | null;
          id?: string;
          is_active?: boolean | null;
          logo_small_url?: string | null;
          logo_url?: string | null;
          mention_legale?: string | null;
          nom_societe?: string;
          signature_url?: string | null;
          siret?: string | null;
          site_web?: string | null;
          slogan?: string | null;
          tampon_url?: string | null;
          telephone?: string | null;
          updated_at?: string | null;
          ville?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'syndic_branding_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
        ];
      };
      tenant_documents: {
        Row: {
          expiry_date: string | null;
          file_name: string;
          file_path: string;
          file_size: number | null;
          id: string;
          mime_type: string | null;
          notes: string | null;
          tenant_id: string;
          type: string;
          uploaded_at: string | null;
          uploaded_by: string | null;
        };
        Insert: {
          expiry_date?: string | null;
          file_name: string;
          file_path: string;
          file_size?: number | null;
          id?: string;
          mime_type?: string | null;
          notes?: string | null;
          tenant_id: string;
          type: string;
          uploaded_at?: string | null;
          uploaded_by?: string | null;
        };
        Update: {
          expiry_date?: string | null;
          file_name?: string;
          file_path?: string;
          file_size?: number | null;
          id?: string;
          mime_type?: string | null;
          notes?: string | null;
          tenant_id?: string;
          type?: string;
          uploaded_at?: string | null;
          uploaded_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tenant_documents_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tenant_documents_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['tenant_id'];
          },
          {
            foreignKeyName: 'tenant_documents_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['tenant_id'];
          },
        ];
      };
      tenants: {
        Row: {
          apartment_id: string;
          bic: string | null;
          bic_encrypted: string | null;
          clause_revision_loyer: boolean | null;
          clause_solidarite: boolean | null;
          created_at: string | null;
          created_by: string | null;
          date_debut_emploi: string | null;
          date_derniere_revision: string | null;
          date_entree: string;
          date_fin_bail: string | null;
          date_sortie: string | null;
          depot_garantie: number | null;
          duree_bail: number | null;
          email: string | null;
          employeur: string | null;
          first_name: string;
          iban: string | null;
          iban_encrypted: string | null;
          id: string;
          irl_reference_id: string | null;
          is_main_tenant: boolean | null;
          last_name: string;
          motif_sortie: string | null;
          nb_adultes: number | null;
          nb_enfants: number | null;
          phone: string | null;
          profession: string | null;
          revenus_mensuels: number | null;
          status: string | null;
          titulaire_compte: string | null;
          trimestre_reference: number | null;
          type_bail: string | null;
          type_contrat: string | null;
          type_garantie: string | null;
          updated_at: string | null;
        };
        Insert: {
          apartment_id: string;
          bic?: string | null;
          bic_encrypted?: string | null;
          clause_revision_loyer?: boolean | null;
          clause_solidarite?: boolean | null;
          created_at?: string | null;
          created_by?: string | null;
          date_debut_emploi?: string | null;
          date_derniere_revision?: string | null;
          date_entree: string;
          date_fin_bail?: string | null;
          date_sortie?: string | null;
          depot_garantie?: number | null;
          duree_bail?: number | null;
          email?: string | null;
          employeur?: string | null;
          first_name: string;
          iban?: string | null;
          iban_encrypted?: string | null;
          id?: string;
          irl_reference_id?: string | null;
          is_main_tenant?: boolean | null;
          last_name: string;
          motif_sortie?: string | null;
          nb_adultes?: number | null;
          nb_enfants?: number | null;
          phone?: string | null;
          profession?: string | null;
          revenus_mensuels?: number | null;
          status?: string | null;
          titulaire_compte?: string | null;
          trimestre_reference?: number | null;
          type_bail?: string | null;
          type_contrat?: string | null;
          type_garantie?: string | null;
          updated_at?: string | null;
        };
        Update: {
          apartment_id?: string;
          bic?: string | null;
          bic_encrypted?: string | null;
          clause_revision_loyer?: boolean | null;
          clause_solidarite?: boolean | null;
          created_at?: string | null;
          created_by?: string | null;
          date_debut_emploi?: string | null;
          date_derniere_revision?: string | null;
          date_entree?: string;
          date_fin_bail?: string | null;
          date_sortie?: string | null;
          depot_garantie?: number | null;
          duree_bail?: number | null;
          email?: string | null;
          employeur?: string | null;
          first_name?: string;
          iban?: string | null;
          iban_encrypted?: string | null;
          id?: string;
          irl_reference_id?: string | null;
          is_main_tenant?: boolean | null;
          last_name?: string;
          motif_sortie?: string | null;
          nb_adultes?: number | null;
          nb_enfants?: number | null;
          phone?: string | null;
          profession?: string | null;
          revenus_mensuels?: number | null;
          status?: string | null;
          titulaire_compte?: string | null;
          trimestre_reference?: number | null;
          type_bail?: string | null;
          type_contrat?: string | null;
          type_garantie?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tenants_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tenants_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tenants_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
          {
            foreignKeyName: 'tenants_irl_reference_id_fkey';
            columns: ['irl_reference_id'];
            isOneToOne: false;
            referencedRelation: 'irl_values';
            referencedColumns: ['id'];
          },
        ];
      };
      travaux: {
        Row: {
          apartment_id: string | null;
          assigne_a: string | null;
          budget_estime: number | null;
          budget_reel: number | null;
          cabinet_id: string;
          categorie: string | null;
          copropriete_id: string;
          created_at: string;
          created_by: string;
          date_creation: string | null;
          date_debut: string | null;
          date_fin_prevue: string | null;
          date_fin_reelle: string | null;
          description: string | null;
          devis_urls: string[] | null;
          entreprise_email: string | null;
          entreprise_nom: string | null;
          entreprise_telephone: string | null;
          facture_urls: string[] | null;
          frequence: string | null;
          id: string;
          photos_urls: string[] | null;
          priorite: string | null;
          prochaine_date: string | null;
          progression: number | null;
          statut: string | null;
          titre: string;
          type_travaux: string;
          updated_at: string;
        };
        Insert: {
          apartment_id?: string | null;
          assigne_a?: string | null;
          budget_estime?: number | null;
          budget_reel?: number | null;
          cabinet_id: string;
          categorie?: string | null;
          copropriete_id: string;
          created_at?: string;
          created_by?: string;
          date_creation?: string | null;
          date_debut?: string | null;
          date_fin_prevue?: string | null;
          date_fin_reelle?: string | null;
          description?: string | null;
          devis_urls?: string[] | null;
          entreprise_email?: string | null;
          entreprise_nom?: string | null;
          entreprise_telephone?: string | null;
          facture_urls?: string[] | null;
          frequence?: string | null;
          id?: string;
          photos_urls?: string[] | null;
          priorite?: string | null;
          prochaine_date?: string | null;
          progression?: number | null;
          statut?: string | null;
          titre: string;
          type_travaux: string;
          updated_at?: string;
        };
        Update: {
          apartment_id?: string | null;
          assigne_a?: string | null;
          budget_estime?: number | null;
          budget_reel?: number | null;
          cabinet_id?: string;
          categorie?: string | null;
          copropriete_id?: string;
          created_at?: string;
          created_by?: string;
          date_creation?: string | null;
          date_debut?: string | null;
          date_fin_prevue?: string | null;
          date_fin_reelle?: string | null;
          description?: string | null;
          devis_urls?: string[] | null;
          entreprise_email?: string | null;
          entreprise_nom?: string | null;
          entreprise_telephone?: string | null;
          facture_urls?: string[] | null;
          frequence?: string | null;
          id?: string;
          photos_urls?: string[] | null;
          priorite?: string | null;
          prochaine_date?: string | null;
          progression?: number | null;
          statut?: string | null;
          titre?: string;
          type_travaux?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'travaux_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'travaux_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'travaux_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
          {
            foreignKeyName: 'travaux_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'travaux_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'travaux_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'travaux_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'travaux_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'travaux_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      unpaid_rents: {
        Row: {
          apartment_id: string;
          created_at: string;
          created_by: string;
          date_echeance: string;
          date_paiement: string | null;
          derniere_relance: string | null;
          id: string;
          jours_retard: number | null;
          mois_concerne: string;
          montant_charges: number | null;
          montant_loyer: number;
          montant_paye: number | null;
          montant_total: number | null;
          nombre_relances: number | null;
          notes: string | null;
          relances: Json | null;
          statut: string | null;
          tenant_id: string | null;
          updated_at: string;
        };
        Insert: {
          apartment_id: string;
          created_at?: string;
          created_by?: string;
          date_echeance: string;
          date_paiement?: string | null;
          derniere_relance?: string | null;
          id?: string;
          jours_retard?: number | null;
          mois_concerne: string;
          montant_charges?: number | null;
          montant_loyer: number;
          montant_paye?: number | null;
          montant_total?: number | null;
          nombre_relances?: number | null;
          notes?: string | null;
          relances?: Json | null;
          statut?: string | null;
          tenant_id?: string | null;
          updated_at?: string;
        };
        Update: {
          apartment_id?: string;
          created_at?: string;
          created_by?: string;
          date_echeance?: string;
          date_paiement?: string | null;
          derniere_relance?: string | null;
          id?: string;
          jours_retard?: number | null;
          mois_concerne?: string;
          montant_charges?: number | null;
          montant_loyer?: number;
          montant_paye?: number | null;
          montant_total?: number | null;
          nombre_relances?: number | null;
          notes?: string | null;
          relances?: Json | null;
          statut?: string | null;
          tenant_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'unpaid_rents_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'unpaid_rents_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'unpaid_rents_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
        ];
      };
    };
    Views: {
      assemblees_stats: {
        Row: {
          convocations_envoyees: boolean | null;
          convocations_envoyees_count: number | null;
          copropriete_id: string | null;
          copropriete_nom: string | null;
          date_assemblee: string | null;
          id: string | null;
          nombre_resolutions: number | null;
          participants_presents: number | null;
          participants_total: number | null;
          procurations_validees: number | null;
          resolutions_adoptees: number | null;
          statut: string | null;
          taux_participation: number | null;
          titre: string | null;
          type: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'assemblees_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'assemblees_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'assemblees_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'assemblees_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'assemblees_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      compte_rendu_envois_stats: {
        Row: {
          assemblee_id: string | null;
          compte_rendu_id: string | null;
          cr_statut: string | null;
          envois_delivres: number | null;
          envois_echecs: number | null;
          envois_envoyes: number | null;
          envois_ouverts: number | null;
          taux_ouverture: number | null;
          total_envois: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'compte_rendu_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: true;
            referencedRelation: 'assemblees';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'compte_rendu_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: true;
            referencedRelation: 'assemblees_stats';
            referencedColumns: ['id'];
          },
        ];
      };
      coproprietes_stats: {
        Row: {
          active_incidents: number | null;
          adresse: string | null;
          commission: number | null;
          created_by: string | null;
          id: string | null;
          nom: string | null;
          nombre_appartements: number | null;
          occupied_apartments: number | null;
          total_apartments: number | null;
          total_loyers: number | null;
          unpaid_count: number | null;
          vacant_apartments: number | null;
          ville: string | null;
        };
        Relationships: [];
      };
      cron_jobs_dashboard: {
        Row: {
          avg_duration_seconds: number | null;
          description: string | null;
          failed_runs: number | null;
          is_active: boolean | null;
          job_name: string | null;
          last_run_at: string | null;
          last_run_status: string | null;
          next_run_at: string | null;
          runs_last_30_days: number | null;
          schedule: string | null;
          successful_runs: number | null;
        };
        Relationships: [];
      };
      email_statistics: {
        Row: {
          count: number | null;
          date: string | null;
          failed_count: number | null;
          sent_count: number | null;
          status: string | null;
          type: string | null;
        };
        Relationships: [];
      };
      error_dashboard: {
        Row: {
          affected_users: number | null;
          count: number | null;
          error_type: string | null;
          hour: string | null;
          severity: string | null;
        };
        Relationships: [];
      };
      frequent_errors: {
        Row: {
          affected_users: number | null;
          code: string | null;
          error_type: string | null;
          last_occurrence: string | null;
          message: string | null;
          occurrence_count: number | null;
          user_message: string | null;
        };
        Relationships: [];
      };
      notes_ag_stats: {
        Row: {
          assemblee_id: string | null;
          notes_actions: number | null;
          notes_decisions: number | null;
          notes_discussions: number | null;
          notes_generales: number | null;
          notes_incidents: number | null;
          notes_liees_resolutions: number | null;
          notes_questions: number | null;
          total_notes: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notes_ag_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: false;
            referencedRelation: 'assemblees';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notes_ag_assemblee_id_fkey';
            columns: ['assemblee_id'];
            isOneToOne: false;
            referencedRelation: 'assemblees_stats';
            referencedColumns: ['id'];
          },
        ];
      };
      performance_metrics: {
        Row: {
          avg_duration_ms: number | null;
          error_count: number | null;
          hour: string | null;
          max_duration_ms: number | null;
          metric_name: string | null;
          metric_type: string | null;
          p95_ms: number | null;
          total_calls: number | null;
        };
        Relationships: [];
      };
      v_apartments_with_owners: {
        Row: {
          balcon: boolean | null;
          batiment: string | null;
          cave: boolean | null;
          charges: number | null;
          cle_boite_lettres: string | null;
          code_entree: string | null;
          copropriete_id: string | null;
          created_at: string | null;
          created_by: string | null;
          date_entree: string | null;
          date_sortie: string | null;
          depot_garantie: number | null;
          etage: number | null;
          floor: number | null;
          id: string | null;
          last_payment: string | null;
          loyer: number | null;
          mandat_gestion: boolean | null;
          montant_honoraires: number | null;
          nombre_pieces: number | null;
          numero: string | null;
          owner_email: string | null;
          owner_id: string | null;
          owner_nom: string | null;
          owner_prenom: string | null;
          owner_telephone: string | null;
          parking_inclus: boolean | null;
          porte: string | null;
          quote_part_propriete: number | null;
          status: string | null;
          superficie: number | null;
          surface: number | null;
          tenant_email: string | null;
          tenant_name: string | null;
          tenant_phone: string | null;
          terrasse: boolean | null;
          type_honoraires: Database['public']['Enums']['type_honoraires'] | null;
          type_lot: string | null;
          updated_at: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'apartments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'apartments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'apartments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'apartments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'apartments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      v_copropriete_coproprietaires: {
        Row: {
          copropriete_id: string | null;
          nb_coproprietaires: number | null;
          total_tantiemes: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'coproprietaires_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'coproprietaires_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'coproprietaires_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'coproprietaires_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'coproprietaires_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      v_copropriete_finances: {
        Row: {
          budget_annuel_prevu: number | null;
          charges_courantes_exercice: number | null;
          charges_exceptionnelles_exercice: number | null;
          copropriete_id: string | null;
          copropriete_nom: string | null;
          fond_travaux: number | null;
          nb_coproprietaires_debiteurs: number | null;
          solde_fonds_travaux: number | null;
          total_impayes: number | null;
        };
        Insert: {
          budget_annuel_prevu?: number | null;
          charges_courantes_exercice?: never;
          charges_exceptionnelles_exercice?: never;
          copropriete_id?: string | null;
          copropriete_nom?: string | null;
          fond_travaux?: number | null;
          nb_coproprietaires_debiteurs?: never;
          solde_fonds_travaux?: never;
          total_impayes?: never;
        };
        Update: {
          budget_annuel_prevu?: number | null;
          charges_courantes_exercice?: never;
          charges_exceptionnelles_exercice?: never;
          copropriete_id?: string | null;
          copropriete_nom?: string | null;
          fond_travaux?: number | null;
          nb_coproprietaires_debiteurs?: never;
          solde_fonds_travaux?: never;
          total_impayes?: never;
        };
        Relationships: [];
      };
      v_copropriete_lots: {
        Row: {
          copropriete_id: string | null;
          lots_autre: number | null;
          lots_bureau: number | null;
          lots_cave: number | null;
          lots_commerce: number | null;
          lots_habitation: number | null;
          lots_parking: number | null;
          surface_totale_lots: number | null;
          total_lots: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'apartments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'apartments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'apartments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'apartments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'apartments_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      v_data_retention_status: {
        Row: {
          action: string | null;
          is_active: boolean | null;
          legal_basis: string | null;
          retention_days: number | null;
          retention_display: string | null;
          table_name: string | null;
        };
        Insert: {
          action?: string | null;
          is_active?: boolean | null;
          legal_basis?: string | null;
          retention_days?: number | null;
          retention_display?: never;
          table_name?: string | null;
        };
        Update: {
          action?: string | null;
          is_active?: boolean | null;
          legal_basis?: string | null;
          retention_days?: number | null;
          retention_display?: never;
          table_name?: string | null;
        };
        Relationships: [];
      };
      v_depot_garantie_a_traiter: {
        Row: {
          apartment_id: string | null;
          appartement_numero: string | null;
          bic_restitution: string | null;
          cabinet_id: string | null;
          commentaire: string | null;
          copropriete_nom: string | null;
          created_at: string | null;
          created_by: string | null;
          date_edl_sortie: string | null;
          date_entree: string | null;
          date_limite_restitution: string | null;
          date_restitution_effective: string | null;
          date_sortie: string | null;
          date_virement: string | null;
          delai_restitution_mois: number | null;
          document_solde_url: string | null;
          edl_conforme: boolean | null;
          en_retard: boolean | null;
          iban_restitution: string | null;
          id: string | null;
          jours_restants: number | null;
          locataire_email: string | null;
          locataire_nom: string | null;
          locataire_phone: string | null;
          loyer_mensuel: number | null;
          mois_de_retard: number | null;
          mois_retard: number | null;
          montant_a_restituer: number | null;
          montant_autres_retenues: number | null;
          montant_impayes_charges: number | null;
          montant_impayes_loyers: number | null;
          montant_initial: number | null;
          montant_provision_charges: number | null;
          montant_reparations: number | null;
          montant_total_retenues: number | null;
          motif_contestation: string | null;
          penalites_retard: number | null;
          reference_virement: string | null;
          statut: string | null;
          tenant_id: string | null;
          titulaire_compte: string | null;
          updated_at: string | null;
          updated_by: string | null;
          urgence: string | null;
          validated_at: string | null;
          validated_by: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'depot_garantie_restitutions_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'depot_garantie_restitutions_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'depot_garantie_restitutions_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
          {
            foreignKeyName: 'depot_garantie_restitutions_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'depot_garantie_restitutions_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'depot_garantie_restitutions_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['tenant_id'];
          },
          {
            foreignKeyName: 'depot_garantie_restitutions_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['tenant_id'];
          },
        ];
      };
      v_etats_dates_dashboard: {
        Row: {
          cabinet_id: string | null;
          coproprietaire_id: string | null;
          coproprietaire_nom: string | null;
          coproprietaire_prenom: string | null;
          copropriete_id: string | null;
          copropriete_nom: string | null;
          date_demande: string | null;
          date_limite_reponse: string | null;
          date_vente_prevue: string | null;
          demandeur_nom: string | null;
          demandeur_type: string | null;
          facture_generee: boolean | null;
          facturer: boolean | null;
          id: string | null;
          jours_restants: number | null;
          lot_ids: string[] | null;
          montant_facture: number | null;
          solde_final: number | null;
          statut: string | null;
          type_document: string | null;
          urgence: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'etats_dates_coproprietaire_id_fkey';
            columns: ['coproprietaire_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietaires';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'etats_dates_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'etats_dates_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'etats_dates_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'etats_dates_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'etats_dates_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      v_locataires_sortis_sans_restitution: {
        Row: {
          apartment_id: string | null;
          appartement_numero: string | null;
          cabinet_id: string | null;
          copropriete_id: string | null;
          copropriete_nom: string | null;
          date_limite_estimee: string | null;
          date_sortie: string | null;
          depot_garantie: number | null;
          jours_depuis_sortie: number | null;
          locataire_email: string | null;
          locataire_nom: string | null;
          tenant_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'coproprietes_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tenants_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'apartments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tenants_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_apartments_with_owners';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tenants_apartment_id_fkey';
            columns: ['apartment_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['apartment_id'];
          },
        ];
      };
      v_owners_with_apartments: {
        Row: {
          adresse: string | null;
          civilite: string | null;
          code_postal: string | null;
          created_at: string | null;
          date_naissance: string | null;
          email: string | null;
          id: string | null;
          lieu_naissance: string | null;
          loyers_geres_total: number | null;
          nb_lots_actifs: number | null;
          nom: string | null;
          notes: string | null;
          numero_fiscal: string | null;
          pays: string | null;
          prenom: string | null;
          regime_fiscal: Database['public']['Enums']['regime_fiscal'] | null;
          statut: Database['public']['Enums']['owner_status'] | null;
          telephone: string | null;
          type: Database['public']['Enums']['owner_type'] | null;
          updated_at: string | null;
          ville: string | null;
        };
        Relationships: [];
      };
      v_ppt_budget_annuel: {
        Row: {
          annee: number | null;
          budget_appels: number | null;
          budget_estime: number | null;
          budget_fonds_travaux: number | null;
          budget_reel: number | null;
          budget_subventions: number | null;
          copropriete_id: string | null;
          nb_en_cours: number | null;
          nb_planifies: number | null;
          nb_realises: number | null;
          nb_travaux: number | null;
          plan_nom: string | null;
          plan_travaux_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'plan_travaux_items_plan_travaux_id_fkey';
            columns: ['plan_travaux_id'];
            isOneToOne: false;
            referencedRelation: 'plans_travaux';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plans_travaux_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plans_travaux_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'coproprietes_stats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plans_travaux_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_copropriete_finances';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'plans_travaux_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_locataires_sortis_sans_restitution';
            referencedColumns: ['copropriete_id'];
          },
          {
            foreignKeyName: 'plans_travaux_copropriete_id_fkey';
            columns: ['copropriete_id'];
            isOneToOne: false;
            referencedRelation: 'v_revisions_loyer_a_venir';
            referencedColumns: ['copropriete_id'];
          },
        ];
      };
      v_ppt_par_categorie: {
        Row: {
          budget_total: number | null;
          categorie: string | null;
          derniere_annee: number | null;
          nb_travaux: number | null;
          plan_travaux_id: string | null;
          premiere_annee: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'plan_travaux_items_plan_travaux_id_fkey';
            columns: ['plan_travaux_id'];
            isOneToOne: false;
            referencedRelation: 'plans_travaux';
            referencedColumns: ['id'];
          },
        ];
      };
      v_revisions_loyer_a_venir: {
        Row: {
          apartment_id: string | null;
          appartement_numero: string | null;
          cabinet_id: string | null;
          charges: number | null;
          clause_revision_loyer: boolean | null;
          copropriete_id: string | null;
          copropriete_nom: string | null;
          date_derniere_revision: string | null;
          date_entree: string | null;
          jours_avant_revision: number | null;
          locataire_email: string | null;
          locataire_nom: string | null;
          loyer: number | null;
          prochaine_date_revision: string | null;
          tenant_id: string | null;
          trimestre_reference: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'coproprietes_cabinet_id_fkey';
            columns: ['cabinet_id'];
            isOneToOne: false;
            referencedRelation: 'cabinets';
            referencedColumns: ['id'];
          },
        ];
      };
      v_rgpd_compliance_status: {
        Row: {
          category: string | null;
          configured: number | null;
          missing: number | null;
          status: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      anonymize_qualification_data: {
        Args: { p_months_after_entry?: number };
        Returns: number;
      };
      archiver_locataires_fin_preavis: { Args: never; Returns: number };
      calculer_penalites_retard: {
        Args: {
          p_date_limite: string;
          p_date_reference?: string;
          p_loyer_hc: number;
        };
        Returns: {
          mois_retard: number;
          penalites: number;
        }[];
      };
      calculer_revision_loyer: {
        Args: {
          p_irl_ancien: number;
          p_irl_nouveau: number;
          p_loyer_actuel: number;
        };
        Returns: {
          augmentation: number;
          nouveau_loyer: number;
          pourcentage: number;
        }[];
      };
      cleanup_expired_documents: {
        Args: never;
        Returns: {
          document_type: string;
          documents_deleted: number;
        }[];
      };
      clear_plaintext_iban: {
        Args: never;
        Returns: {
          records_cleared: number;
          tbl_name: string;
        }[];
      };
      create_etat_date_with_calculation: {
        Args: {
          p_cabinet_id?: string;
          p_coproprietaire_id: string;
          p_copropriete_id: string;
          p_date_vente_prevue?: string;
          p_demandeur_adresse?: string;
          p_demandeur_email?: string;
          p_demandeur_nom: string;
          p_demandeur_telephone?: string;
          p_demandeur_type: string;
          p_lot_ids: string[];
          p_reference_dossier?: string;
          p_type_document: string;
        };
        Returns: string;
      };
      creer_dossier_restitution: {
        Args: {
          p_apartment_id: string;
          p_cabinet_id: string;
          p_date_edl_sortie?: string;
          p_edl_conforme?: boolean;
          p_tenant_id: string;
        };
        Returns: string;
      };
      decrypt_sensitive_data: { Args: { p_data: string }; Returns: string };
      encrypt_sensitive_data: { Args: { p_data: string }; Returns: string };
      get_current_user_profile: {
        Args: never;
        Returns: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          favorite_coproprietes: string[] | null;
          first_name: string | null;
          id: string;
          last_login: string | null;
          last_name: string | null;
          phone: string | null;
          preferences: Json | null;
          role: string | null;
          updated_at: string;
        };
        SetofOptions: {
          from: '*';
          to: 'profiles';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      get_decrypted_bank_data: {
        Args: { p_record_id: string; p_table_name: string };
        Returns: {
          bic: string;
          iban: string;
          titulaire_compte: string;
        }[];
      };
      get_derniere_ag_approuvee: {
        Args: { p_copropriete_id: string };
        Returns: {
          date_ag: string;
          date_approbation_comptes: string;
        }[];
      };
      get_goal_history: {
        Args: { p_goal_id: string; p_limit?: number };
        Returns: {
          cible: number;
          progression: number;
          recorded_at: string;
          valeur_actuelle: number;
        }[];
      };
      get_irl: {
        Args: { p_annee: number; p_trimestre: number };
        Returns: number;
      };
      get_ppt_budget_restant: {
        Args: { p_plan_id: string };
        Returns: {
          budget_realise: number;
          budget_restant: number;
          budget_total_estime: number;
          pourcentage_realise: number;
        }[];
      };
      get_user_cabinet_id: { Args: never; Returns: string };
      has_role: { Args: { required_role: string }; Returns: boolean };
      is_admin: { Args: never; Returns: boolean };
      is_cabinet_admin: { Args: never; Returns: boolean };
      log_document_access: {
        Args: {
          p_access_type: string;
          p_document_id: string;
          p_document_table: string;
          p_document_type: string;
          p_ip_address?: unknown;
          p_reason?: string;
          p_user_agent?: string;
          p_user_id: string;
        };
        Returns: string;
      };
      mask_iban: { Args: { p_iban: string }; Returns: string };
      migrate_coproprietaires_iban: {
        Args: never;
        Returns: {
          records_migrated: number;
        }[];
      };
      migrate_iban_to_encrypted: {
        Args: never;
        Returns: {
          records_migrated: number;
          tbl_name: string;
        }[];
      };
      record_consent: {
        Args: {
          p_cgu_version?: string;
          p_entity_id: string;
          p_entity_type: string;
          p_ip_address?: unknown;
          p_source: string;
          p_user_agent?: string;
        };
        Returns: string;
      };
      run_rgpd_cleanup: {
        Args: never;
        Returns: {
          operation: string;
          records_affected: number;
        }[];
      };
      save_encrypted_bank_data: {
        Args: {
          p_bic?: string;
          p_iban?: string;
          p_record_id: string;
          p_table_name: string;
          p_titulaire?: string;
        };
        Returns: boolean;
      };
      withdraw_consent: {
        Args: { p_entity_id: string; p_entity_type: string; p_reason?: string };
        Returns: boolean;
      };
    };
    Enums: {
      activity_type: 'AG' | 'Incident' | 'Paiement' | 'Message';
      apartment_status: 'Occupé' | 'Vacant';
      assembly_status: 'brouillon' | 'planifiee' | 'en_cours' | 'terminee' | 'annulee';
      assembly_type: 'ordinaire' | 'extraordinaire' | 'budgetaire';
      chauffage_type: 'individuel' | 'collectif' | 'urbain' | 'electrique' | 'gaz';
      communication_type: 'email' | 'sms' | 'courrier' | 'notification' | 'annonce';
      depot_garantie_statut:
        | 'en_attente'
        | 'en_cours'
        | 'validee'
        | 'restituee'
        | 'contestee'
        | 'annulee';
      document_type:
        | 'pv'
        | 'reglement'
        | 'budget'
        | 'contrat'
        | 'facture'
        | 'assurance'
        | 'diagnostic'
        | 'autre';
      incident_action:
        | 'created'
        | 'updated'
        | 'status_changed'
        | 'assigned'
        | 'resolved'
        | 'reopened'
        | 'comment_added';
      incident_status: 'Résolu' | 'En cours' | 'En attente';
      incident_type: 'Plomberie' | 'Électricité' | 'Chauffage' | 'Autre';
      notification_type:
        | 'ag'
        | 'payment'
        | 'travaux'
        | 'incident'
        | 'document'
        | 'message'
        | 'rappel'
        | 'autre';
      owner_document_type:
        | 'mandat_gestion'
        | 'identite'
        | 'rib'
        | 'titre_propriete'
        | 'compte_rendu_gestion'
        | 'declaration_fiscale'
        | 'autre';
      owner_status: 'actif' | 'archivé';
      owner_type: 'particulier' | 'sci' | 'indivision';
      parking_status: 'Occupée' | 'Libre';
      parking_type: 'Propriétaire' | 'Location';
      payment_status: 'À jour' | 'Retard' | 'Contentieux' | 'Partiel';
      priority_level: 'haute' | 'moyenne' | 'basse';
      quittance_status: 'brouillon' | 'generee' | 'envoyee' | 'annulee';
      regime_fiscal: 'micro_foncier' | 'reel';
      rent_payment_method: 'virement_sepa' | 'prelevement_sepa' | 'cheque' | 'especes';
      rent_payment_status: 'attendu' | 'paye' | 'en_retard' | 'partiellement_paye' | 'annule';
      travaux_status: 'planifie' | 'en_cours' | 'termine' | 'annule' | 'en_attente';
      type_honoraires: 'pourcentage' | 'forfait';
      type_occupation: 'proprietaire' | 'locataire';
      type_retenue:
        | 'loyer_impaye'
        | 'charges_impayees'
        | 'reparation_locative'
        | 'provision_charges'
        | 'degradation'
        | 'nettoyage'
        | 'autre';
      user_role: 'user' | 'admin' | 'syndic' | 'coproprietaire' | 'locataire';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      activity_type: ['AG', 'Incident', 'Paiement', 'Message'],
      apartment_status: ['Occupé', 'Vacant'],
      assembly_status: ['brouillon', 'planifiee', 'en_cours', 'terminee', 'annulee'],
      assembly_type: ['ordinaire', 'extraordinaire', 'budgetaire'],
      chauffage_type: ['individuel', 'collectif', 'urbain', 'electrique', 'gaz'],
      communication_type: ['email', 'sms', 'courrier', 'notification', 'annonce'],
      depot_garantie_statut: [
        'en_attente',
        'en_cours',
        'validee',
        'restituee',
        'contestee',
        'annulee',
      ],
      document_type: [
        'pv',
        'reglement',
        'budget',
        'contrat',
        'facture',
        'assurance',
        'diagnostic',
        'autre',
      ],
      incident_action: [
        'created',
        'updated',
        'status_changed',
        'assigned',
        'resolved',
        'reopened',
        'comment_added',
      ],
      incident_status: ['Résolu', 'En cours', 'En attente'],
      incident_type: ['Plomberie', 'Électricité', 'Chauffage', 'Autre'],
      notification_type: [
        'ag',
        'payment',
        'travaux',
        'incident',
        'document',
        'message',
        'rappel',
        'autre',
      ],
      owner_document_type: [
        'mandat_gestion',
        'identite',
        'rib',
        'titre_propriete',
        'compte_rendu_gestion',
        'declaration_fiscale',
        'autre',
      ],
      owner_status: ['actif', 'archivé'],
      owner_type: ['particulier', 'sci', 'indivision'],
      parking_status: ['Occupée', 'Libre'],
      parking_type: ['Propriétaire', 'Location'],
      payment_status: ['À jour', 'Retard', 'Contentieux', 'Partiel'],
      priority_level: ['haute', 'moyenne', 'basse'],
      quittance_status: ['brouillon', 'generee', 'envoyee', 'annulee'],
      regime_fiscal: ['micro_foncier', 'reel'],
      rent_payment_method: ['virement_sepa', 'prelevement_sepa', 'cheque', 'especes'],
      rent_payment_status: ['attendu', 'paye', 'en_retard', 'partiellement_paye', 'annule'],
      travaux_status: ['planifie', 'en_cours', 'termine', 'annule', 'en_attente'],
      type_honoraires: ['pourcentage', 'forfait'],
      type_occupation: ['proprietaire', 'locataire'],
      type_retenue: [
        'loyer_impaye',
        'charges_impayees',
        'reparation_locative',
        'provision_charges',
        'degradation',
        'nettoyage',
        'autre',
      ],
      user_role: ['user', 'admin', 'syndic', 'coproprietaire', 'locataire'],
    },
  },
} as const;

// ── Convenience type aliases ──
export type IncidentStatus = Database['public']['Enums']['incident_status'];
export type IncidentType = Database['public']['Enums']['incident_type'];
export type IncidentCategory = IncidentType;
