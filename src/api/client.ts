import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "./axios";

export enum ListTicketsCategory {
  COMPLAINT = "COMPLAINT",
  ORDER_MODIFICATION = "ORDER_MODIFICATION",
  ORDER_CANCELLATION = "ORDER_CANCELLATION",
  RETURN_REPLACEMENT = "RETURN_REPLACEMENT",
  ORDER_DELAY_ERROR = "ORDER_DELAY_ERROR",
}

export enum ListTicketsStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING_CUSTOMER = "PENDING_CUSTOMER",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum TicketUpdateStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING_CUSTOMER = "PENDING_CUSTOMER",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum TicketInputCategory {
  COMPLAINT = "COMPLAINT",
  ORDER_MODIFICATION = "ORDER_MODIFICATION",
  ORDER_CANCELLATION = "ORDER_CANCELLATION",
  RETURN_REPLACEMENT = "RETURN_REPLACEMENT",
  ORDER_DELAY_ERROR = "ORDER_DELAY_ERROR",
}

export type TicketStatus =
  ListTicketsStatus;

export type Ticket = {
  id: number;

  category: string;
  status: string;

  customerName?: string;
  phone?: string;

  orderNumber?: string;
  shipmentNumber?: string;

  title?: string;
  description?: string;

  operation?: string;
  productType?: string;
  quantity?: number;

  reason?: string;
  subCategory?: string;

  location?: string;

  imageUrl?: string;

  botPhone?: string;

  aljoufNote?: string;
  customerNote?: string;

    complaintStatus?: string;

  complaintSubmittedAt?:Date;
  notes?:string;

  createdAt?: string;
  updatedAt?: string;
};

export type Stats = {
  total: number;

  complaints: number;
  modifications: number;
  cancellations: number;
  returns: number;
  delays: number;

  new: number;
  inProgress: number;
  resolved: number;
};

export function getListTicketsQueryKey() {
  return ["tickets"];
}

export function getGetStatsQueryKey() {
  return ["stats"];
}

export function getGetStatsTrendQueryKey() {
  return ["stats-trend"];
}

export function getGetStatsByCategoryQueryKey() {
  return ["stats-category"];
}

export function getGetTicketQueryKey(
  id?: number
) {
  return ["ticket", id];
}

export function getHealthCheckQueryKey() {
  return ["health"];
}

export function useGetStats(
  _options?: any
) {
  return useQuery<Stats>({
    queryKey: ["stats"],

    queryFn: async () => {
      const { data } =
        await api.get("/stats");

      return data;
    },
  });
}

export function useGetStatsTrend(
  _options?: any
) {
  return useQuery({
    queryKey: ["stats-trend"],

    queryFn: async () => {
      const { data } =
        await api.get(
          "/stats/trend"
        );

      return data;
    },
  });
}

export function useGetStatsByCategory(
  _options?: any
) {
  return useQuery({
    queryKey: ["stats-category"],

    queryFn: async () => {
      const { data } =
        await api.get(
          "/stats/category"
        );

      return data;
    },
  });
}

export function useListTickets(
  params?: any,
  _options?: any
) {
  return useQuery({
    queryKey: ["tickets", params],

    queryFn: async () => {
      const { data } =
        await api.get("/tickets", {
          params,
        });

      return data;
    },
  });
}

export function useCreateTicketNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      message,
    }: {
      ticketId: number;
      message: string;
    }) => {
      const { data } = await api.post(
        `/tickets/${ticketId}/notes`,
        { message }
      );

      return data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ticket", variables.ticketId],
      });

      queryClient.invalidateQueries({
        queryKey: ["ticket"],
      });
    },
  });
}

export function useGetTicket(
  id?: number,
  _options?: any
) {
  return useQuery({
    queryKey: ["ticket", id],

    enabled: !!id,

    queryFn: async () => {
      const { data } =
        await api.get(
          `/tickets/${id}`
        );

      return data;
    },
  });
}

export function useHealthCheck(
  _options?: any
) {
  return useQuery({
    queryKey: ["health"],

    queryFn: async () => {
      const { data } =
        await api.get("/health");

      return data;
    },
  });
}

export function useCreateTicket() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: any
    ) => {
      const { data } =
        await api.post(
          "/tickets",
          payload
        );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["stats"],
      });
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: any;
    }) => {
      console.log("UPDATE REQUEST", {
        id,
        data,
      });

      const response = await api.patch(
        `/tickets/${id}`,
        data
      );

      console.log(
        "UPDATE RESPONSE",
        response.data
      );

      return response.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["stats"],
      });

      queryClient.invalidateQueries({
        queryKey: ["ticket"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "ticket",
          variables.id,
        ],
      });
    },
  });
}

export function useDeleteTicket() {
  const queryClient =
    useQueryClient();
    

  return useMutation({
    mutationFn: async (
      id: {id:number}
    ) => {

      const { data } =
        await api.delete(
          `/tickets/${id?.id}`
        );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["stats"],
      });
    },
  });
}

export type User = {
  id: number;
  username: string;
  role: "ADMIN" | "USER";
  createdAt: string;
};

export function getUsersQueryKey() {
  return ["users"];
}

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],

    queryFn: async () => {
      const { data } = await api.get("/users");
      return data;
    },
  });
}

export function useDeleteUser() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      id: number
    ) => {
      const { data } =
        await api.delete(
          `/users/${id}`
        );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}

export function useCreateUser() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      username: string;
      password: string;
      role: "ADMIN" | "USER";
    }) => {
      const { data } =
        await api.post(
          "/users",
          payload
        );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}

export function useUpdateUser() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: {
        username?: string;
        password?: string;
        role?: "ADMIN" | "USER";
      };
    }) => {
      const response =
        await api.patch(
          `/users/${id}`,
          data
        );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}