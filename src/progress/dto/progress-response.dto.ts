export class ProgressResponseDto {
  id: number;
  roadmapId: number;
  totalPercentage: number;
  totalTasks: number;
  totalResources: number;
  totalDocumentation: number;
  tasksCompleted: number;
  resourcesCompleted: number;
  documentationCompleted: number;
  
  tasksProgressPercentage: number;
  resourcesProgressPercentage: number;
  documentationProgressPercentage: number;
  
  roadmapItemsProgress: {
    id: number;
    title: string;
    order: number;
    tasksCompleted: number;
    totalTasks: number;
    resourcesCompleted: number;
    totalResources: number;
    documentationCompleted: number;
    totalDocumentation: number;
    itemProgressPercentage: number;
  }[];
}
