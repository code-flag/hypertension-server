import { Request, Response } from "express";
import { prisma } from "../config/database";
import { returnMsg } from "../helper/message-handler";

export async function getDashboardData(selectedState?: string, selectedMonth?: string) {
  // Helper function to format date to "YYYY-MM-DD"
  const formatDate: any = (date: Date) => date.toISOString().split('T')[0];

  // Default filter object
  const filters: any = {};
  if (selectedState) filters.state = selectedState;
  if (selectedMonth) {
    const startOfMonth = new Date(`${selectedMonth}-01`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);
    filters.createdAt = {
      gte: startOfMonth,
      lt: endOfMonth,
    };
  }

  // 1. Overall Total Screenings
  const totalScreenings: any = await prisma.screening.count({ where: filters });

  // 2. Total Screenings by Gender
  const screeningsByGender: any = await prisma.screening.groupBy({
    by: ['gender'],
    _count: { id: true },
    where: filters,
  });

  const screeningsByGenderData: any = screeningsByGender.reduce((acc: any, item: any) => {
    acc[item.gender] = item._count.id;
    return acc;
  }, {});

  // 3. Total Screenings by Age Range
  const screeningsByAgeRange: any = await prisma.screening.groupBy({
    by: ['age'],
    _count: { id: true },
    where: filters,
  });

  const ageRanges: any = {
    '20-40': 0,
    '41-60': 0,
    '61-100': 0,
  };

  screeningsByAgeRange.forEach((item: any) => {
    if (item.age >= 20 && item.age <= 40) ageRanges['20-40'] += item._count.id;
    if (item.age >= 41 && item.age <= 60) ageRanges['41-60'] += item._count.id;
    if (item.age >= 61) ageRanges['61-100'] += item._count.id;
  });

  // 4. Total Screenings by ConfirmationResult and ScreeningResult
  const screeningsByType: any = await prisma.screening.groupBy({
    by: ['confirmationResult', 'screeningResult'],
    _count: { id: true },
    where: filters,
  });

  const screeningsByTypeData: any = screeningsByType.reduce(
    (acc: any, item: any) => {
      acc.confirmation[item.confirmationResult] =
        (acc.confirmation[item.confirmationResult] || 0) + item._count.id;
      acc.screening[item.screeningResult] =
        (acc.screening[item.screeningResult] || 0) + item._count.id;
      return acc;
    },
    { confirmation: {}, screening: {} }
  );

  // 5. Screenings by State (Chart)
  const screeningsByState = await prisma.screening.groupBy({
    by: ['state'],
    _count: { id: true },
  });

  const screeningsByStateChart = {
    labels: screeningsByState.map((item: any) => item.state),
    data: screeningsByState.map((item: any) => item._count.id),
  };

  // 6. Screenings by Month for the First State (Chart)
  const firstState = screeningsByState[0]?.state;
  const screeningsByMonthForFirstState = await prisma.screening.groupBy({
    by: ['createdAt'],
    _count: { id: true },
    where: { state: firstState },
  });

  const screeningsByMonthChart = screeningsByMonthForFirstState.reduce(
    (acc: any, item: any) => {
      const month: any = new Date(item.createdAt).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      acc.labels.push(month);
      acc.data.push(item._count.id);
      return acc;
    },
    { labels: [], data: [] }
  );

  // 7. Screenings by Day for the First Month in the First State
  const firstMonth = screeningsByMonthChart.labels[0];
  const screeningsByDayForFirstMonth = await prisma.screening.groupBy({
    by: ['createdAt'],
    _count: { id: true },
    where: {
      state: firstState,
      createdAt: {
        gte: new Date(`${firstMonth}-01`),
        lt: new Date(`${firstMonth}-01`).setMonth(new Date(`${firstMonth}-01`).getMonth() + 1),
      },
    },
  });

  const screeningsByDayChart = screeningsByDayForFirstMonth.reduce(
    (acc: any, item: any) => {
      const day = formatDate(new Date(item.createdAt));
      acc.labels.push(day);
      acc.data.push(item._count.id);
      return acc;
    },
    { labels: [], data: [] }
  );

  // Combine all results into a single response object
  return {
    totalScreenings,
    screeningsByGender: screeningsByGenderData,
    screeningsByAgeRange: ageRanges,
    screeningsByType: screeningsByTypeData,
    overallScreeningsByState: screeningsByStateChart,
    screeningsByMonthForFirstState: screeningsByMonthChart,
    screeningsByDayForFirstMonth: screeningsByDayChart,
  };
}
