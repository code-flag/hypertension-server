import { PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

// Interface to define the options for pagination
export interface IPaginationOption {
  limit: number; // The number of items to fetch
  offset: number; // The number of items to skip
  sort?: ISort; // Optional sorting order (ascending or descending)
  populate?: IPopulate[]; // Optional populate paths for related data (not implemented in this example)
}

// Interface to specify relationships to populate
interface IPopulate {
  path: string; // The related model path to populate
  select: string[] | null; // Fields to include (or null to include all fields)
}

interface ISort {
  [key: string]: ESortOrder;
}
// Enum for sorting order
enum ESortOrder {
  "desc", // Descending order
  "asc", // Ascending order
}

// Main class to handle pagination for Prisma models
export class PrismaPagination {
  /**
   * Constructor to initialize the pagination class
   * @param models - An array of model names to extend with pagination
   * @param prismaObject - The Prisma client instance
   */
  constructor(
    private models: string[], // Array of model names to extend
    public prismaObject:
      | PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
      | any // Prisma client instance
  ) {}

  /**
   * Initializes pagination extensions for all specified models
   * @returns An object containing the result logger and extended Prisma client
   */
  init() {
    console.log("initiating model pagination extension...");
    console.time("duration"); // Start timing the initialization process

    // Extend each model with the paginate method
    this.models.forEach((model) => {
      this.extendModel(model, this.prismaObject);
    });

    console.timeEnd("duration"); // End timing
    console.log("initialization completed.");

    // Return a helper object with a result logger and the extended Prisma client
    return {
      result: () =>
        console.log({
          models: this.models.join(", "), // Joined model names
          status: "Model pagination extension initiated successfully", // Status message
          total: this.models.length, // Total number of models extended
        }),
      prismaObj: this.prismaObject, // Extended Prisma client object
    };
  }

  /**
   * Extends a specific Prisma model to include the paginate method
   * @param model - The model name to extend
   * @param prisma - The Prisma client instance
   */
  extendModel(model: string, prisma: any) {
    // Extend the Prisma client with the custom paginate method for the model
    this.prismaObject = this.prismaObject.$extends({
      name: model, // Custom extension name for the model
      model: {
        [model]: {
          /**
                     * Custom pagination method for the model
                     * @param query - The query options for filtering or other conditions
                     * @param options - Pagination options (limit
                    /**
                     * Custom pagination method for the model
                     * @param query - The query options for filtering or other conditions
                     * @param options - Pagination options (limit, offset, sort, populate)
                     * @returns A promise that resolves to the paginated result
                     */
          async paginate(query: any, options: IPaginationOption) {
            let { limit, offset, sort, populate } = options;
            offset = typeof offset === "string" ? parseInt(offset) : offset;
            limit = typeof limit === "string" ? parseInt(limit) : limit;

            // Fetch total count of documents matching the query (filtered count)
            const filteredCount = await prisma[model].count({
              ...query, // Apply filtering conditions for this count
            });

            // Fetch total count of all documents in the model (unfiltered count)
            // const totalRecords = await prisma[model].count();

            // Fetch the paginated documents
            const docs: any = await prisma[model].findMany({
              ...query, // Spread the provided query options (e.g., filters)
              skip: offset, // Skip the number of records specified by offset
              take: limit, // Limit the number of records returned
              orderBy: sort, // Apply the sorting order (if provided)
            });

            // Calculate current page number
            const currentPage = Math.floor(offset / limit) + 1;

            const totalPage = Math.ceil(filteredCount / limit);

            // Check if there is a next page
            const hasNext = offset + limit < filteredCount;

            // Check if there is a previous page
            const hasPrevious = offset > 0;

            // Return the result with metadata
            return {
              totalDocuments: filteredCount, // Total documents after applying query filters
              //   totalRecords, // Total documents in the entire model (unfiltered)
              totalPage: totalPage,
              currentPage, // Current page number
              hasNext, // Boolean indicating if there's a next page
              hasPrevious, // Boolean indicating if there's a previous page
              limit, // The limit specified in the options
              data: docs, // The actual paginated data (documents)
            };
          },
        },
      },
    });
  }
}
