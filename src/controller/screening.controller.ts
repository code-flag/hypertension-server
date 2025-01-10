import { Request, Response } from "express";
import { prisma } from "../config/database";
import { returnMsg } from "../helper/message-handler";
import { BadRequestError, NotFoundError } from "../helper/error";
import { startOfMonth, endOfMonth, parseISO, startOfDay, endOfDay } from 'date-fns';

const airtime =  {
     send: (data: any) => {
        console.log("airtime data", data)
        return {success: true, error: false}
     }
};

export const getScreeningChart = async (req: Request, res: Response) => {
  try {
    const {
      gender,
      minAge,
      maxAge,
      location,
      screeningStatus,
      confirmationStatus,
      ppmvNumber,
      facilityAgentNumber,
      state,
      lga,
      facilityCode,
      paymentStatus,
      airtimeRewardStatus,
      fromDate,
      toDate,
      month,
    } = req.query;

    const filters: any = {};

    // Add standard filters
    if (gender) filters.gender = gender;
    if (minAge) filters.age = { gte: parseInt(minAge as string) };
    if (maxAge) filters.age = { lte: parseInt(maxAge as string) };
    if (location) filters.location = location;
    if (screeningStatus) filters.screeningResult = screeningStatus;
    if (confirmationStatus) filters.confirmationResult = confirmationStatus;
    if (ppmvNumber) filters.ppmvPhoneNumber = ppmvNumber;
    if (facilityAgentNumber) filters.facilityAgentNumber = facilityAgentNumber;
    if (state) filters.state = state;
    if (lga) filters.lga = lga;
    if (facilityCode) filters.facilityCode = facilityCode;
    if (paymentStatus) filters.clientRewardStatus = paymentStatus === 'true';
    if (airtimeRewardStatus) filters.ppmvRewardStatus = airtimeRewardStatus === 'true';

    // Handle date filtering
    const now = new Date();

    if (month) {
      // Filter by specific month (either number or word)
      const monthNumber = isNaN(Number(month))
        ? new Date(Date.parse(`${month} 1, ${now.getFullYear()}`)).getMonth() + 1
        : Number(month);

      const year = now.getFullYear();
      const start = startOfMonth(new Date(year, monthNumber - 1));
      const end = endOfMonth(new Date(year, monthNumber - 1));

      filters.createdAt = { gte: start, lte: end };
    } else if (fromDate || toDate) {
      // Filter by fromDate and toDate
      const start = fromDate ? startOfDay(parseISO(fromDate as string)) : startOfMonth(now);
      const end = toDate ? endOfDay(parseISO(toDate as string)) : endOfMonth(now);

      filters.createdAt = { gte: start, lte: end };
    } else {
      // Default to current month
      const start = startOfMonth(now);
      const end = endOfMonth(now);

      filters.createdAt = { gte: start, lte: end };
    }

    // Query data from the database grouped by day
    const screenings = await prisma.screening.groupBy({
      by: ['createdAt', 'screeningResult', 'confirmationResult'],
      where: filters,
      _count: {
        screeningResult: true,
        confirmationResult: true,
      },
    });

    // Process data into the desired format
    const groupedByDay: Record<string, any> = {};

    screenings.forEach((screening: any) => {
      const day = screening.createdAt.toISOString().split('T')[0]; // Group by date
      if (!groupedByDay[day]) {
        groupedByDay[day] = {
          name: `Day ${Object.keys(groupedByDay).length + 1}`,
          series: [],
        };
      }

      // Append screening results
      if (screening.screeningResult === 'positive') {
        groupedByDay[day].series.push({
          name: 'Screening - Positive',
          value: screening._count.screeningResult,
        });
      } else if (screening.screeningResult === 'negative') {
        groupedByDay[day].series.push({
          name: 'Screening - Negative',
          value: screening._count.screeningResult,
        });
      }

      // Append confirmation results
      if (screening.confirmationResult === 'positive') {
        groupedByDay[day].series.push({
          name: 'Confirmation - Positive',
          value: screening._count.confirmationResult,
        });
      } else if (screening.confirmationResult === 'negative') {
        groupedByDay[day].series.push({
          name: 'Confirmation - Negative',
          value: screening._count.confirmationResult,
        });
      }
    });

    // Convert grouped data to an array
    const results = Object.values(groupedByDay);

    res.json({ results });
  } catch (error) {
    console.error('Error fetching screening data:', error);
    res.status(500).json({ error: 'An error occurred while fetching screening data' });
  }
};


// Get Screening by Phone Number
export const getScreeningByPhone = async (req: Request, res: Response) => {
    const { phoneNumber } = req.params;

    const screening = await prisma.screening.findUnique({
        where: { phoneNumber }
    });

    if (!screening) {
        throw new NotFoundError("Screening record not found.");
    }

    returnMsg(res, screening, "Screening retrieved successfully.");
};

// Get All Screenings
export const getAllScreenings = async (req: Request, res: Response) => {
    const { limit = 10, offset = 0, region, date, ppmvCode, facilityCode, status, gender, age } = req.query;

    let query: any = {};
    if (region) query.region = region;
    if (date) query.date = new Date(date as string);
    if (ppmvCode) query.ppmvCode = ppmvCode;
    if (facilityCode) query.facilityCode = facilityCode;
    if (status) query.status = status;
    if (gender) query.gender = gender;
    if (age) query.age = parseInt(age as string);

    const screenings = await prisma.screening.findMany({
        where: query,
        skip: parseInt(offset as string),
        take: parseInt(limit as string),
        orderBy: { createdAt: "desc" }
    });

    returnMsg(res, screenings, "Screenings retrieved successfully.");
};

// Claim Incentive
export const claimIncentive = async (req: Request, res: Response) => {
    const { phoneNumber, code } = req.body;

    const screening = await prisma.screening.findUnique({
        where: { phoneNumber }
    });

    if (!screening || screening.confirmationCode !== code || screening.clientRewardStatus ) {
        throw new BadRequestError("Invalid code or phone number.");
    }

    const reward = await airtime.send({
        phone: phoneNumber,
        amount: 200
    });

    if (!reward.success) {
        throw new BadRequestError("Failed to send airtime reward.");
    }

    returnMsg(res, { phoneNumber }, "Airtime reward claimed successfully.");
};


export const getScreeningCharts2 = async (req: Request, res: Response) => {
  try {
    // Get the date range from the query or use the last 7 days by default
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : new Date(new Date().setDate(new Date().getDate() - 7));
    const end = endDate ? new Date(endDate as string) : new Date();

    // Fetch screenings grouped by day
    const screeningsByDay = await prisma.screening.groupBy({
      by: ["created_at", "verificationStatus", "confirmationStatus", "screeningStatus"],
      _count: { screening_id: true },
      where: {
        created_at: {
          gte: start,
          lte: end,
        },
      },
    });

    // Organize data for the bar chart
    const barChartData: { day: string; status: string; negative: number; positive: number }[] = [];
    const groupedData: { [key: string]: { pending: { positive: number; negative: number }; completed: { positive: number; negative: number } } } = {};

    screeningsByDay.forEach((item: any) => {
      const day = item.created_at.toISOString().split("T")[0];
      const status = item.verificationStatus ? (item.confirmationStatus ? "completed" : "pending") : "pending";
      const result = item.screeningStatus ? "positive" : "negative";

      if (!groupedData[day]) {
        groupedData[day] = {
          pending: { positive: 0, negative: 0 },
          completed: { positive: 0, negative: 0 },
        };
      }

      groupedData[day][status][result] += item._count.screening_id;
    });

    for (const [day, statuses] of Object.entries(groupedData)) {
      barChartData.push({ day, status: "Pending Screening", negative: statuses.pending.negative, positive: statuses.pending.positive });
      barChartData.push({ day, status: "Completed Screening", negative: statuses.completed.negative, positive: statuses.completed.positive });
    }

    // Total counts for the doughnut/pie chart
    const totalScreenings = await prisma.screening.count();
    const unconfirmedScreenings = await prisma.screening.count({
      where: {
        confirmationStatus: false,
      },
    });
    const confirmedScreenings = totalScreenings - unconfirmedScreenings;

    const doughnutChartData = {
      total: totalScreenings,
      unconfirmed: unconfirmedScreenings,
      confirmed: confirmedScreenings,
    };

    // Response
    return returnMsg(res, { barChartData, doughnutChartData }, "Chart data retrieved successfully");
  } catch (error: any) {
    console.error("Error generating screening charts:", error);
    return res.status(500).json({ message: "An error occurred while generating screening charts." });
  }
};
