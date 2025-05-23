import { useQuery } from "@tanstack/react-query";

type DashboardData = {
  metrics: {
    totalShipments: number;
    totalItems: number;
    pendingApprovals: number;
    activeRecipients: number;
    shipmentsTrend: number;
    itemsTrend: number;
    approvalsTrend: number;
    recipientsTrend: number;
    statusDistribution: Array<{
      name: string;
      percentage: number;
    }>;
  };
  recentShipments: Array<{
    id: string;
    number: number;
    status: string;
    totalValue: number;
    createdAt: string; // Added date field for the chart
    recipient: {
      businessInfo: {
        tradeName?: string;
        nameCorporateReason?: string;
      };
    };
  }>;
};

const mockDashboardApi = (): Promise<DashboardData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        metrics: {
          totalShipments: 245,
          totalItems: 12345,
          pendingApprovals: 15,
          activeRecipients: 42,
          shipmentsTrend: 12.5,
          itemsTrend: 8.2,
          approvalsTrend: -5.3,
          recipientsTrend: 2.1,
          statusDistribution: [
            { name: "Pendente", percentage: 15 },
            { name: "Confirmado", percentage: 25 },
            { name: "Produzindo", percentage: 35 },
            { name: "Finalizado", percentage: 20 },
            { name: "Coletado", percentage: 5 },
          ],
        },
        recentShipments: [
          {
            id: "SM-001",
            number: 1024,
            status: "Produzindo",
            totalValue: 24500,
            createdAt: "2024-03-01T10:00:00",
            recipient: {
              businessInfo: {
                tradeName: "Costureiras Unidas LTDA",
              },
            },
          },
          {
            id: "SM-002",
            number: 1025,
            status: "Pendente",
            totalValue: 18200,
            createdAt: "2024-03-03T14:30:00",
            recipient: {
              businessInfo: {
                nameCorporateReason: "Maria Silva Confecções",
              },
            },
          },
          {
            id: "SM-003",
            number: 1026,
            status: "Finalizado",
            totalValue: 31500,
            createdAt: "2024-03-05T09:15:00",
            recipient: {
              businessInfo: {
                tradeName: "Moda Express",
              },
            },
          },
          {
            id: "SM-004",
            number: 1027,
            status: "Confirmado",
            totalValue: 12750,
            createdAt: "2024-03-05T16:45:00",
            recipient: {
              businessInfo: {
                nameCorporateReason: "João Pereira Textil",
              },
            },
          },
          // Add more sample data for better chart visualization
          {
            id: "SM-005",
            number: 1028,
            status: "Produzindo",
            totalValue: 28400,
            createdAt: "2024-03-08T11:20:00",
            recipient: {
              businessInfo: {
                tradeName: "Confecções Modernas",
              },
            },
          },
          {
            id: "SM-006",
            number: 1029,
            status: "Finalizado",
            totalValue: 19500,
            createdAt: "2024-03-08T14:00:00",
            recipient: {
              businessInfo: {
                nameCorporateReason: "Ana Costa Tecidos",
              },
            },
          },
        ],
      });
    }, 500);
  });
};

export const useDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      // For real implementation, use:
      // const response = await axios.get("/api/dashboard");
      // return response.data;
      return mockDashboardApi();
    },
  });
};
