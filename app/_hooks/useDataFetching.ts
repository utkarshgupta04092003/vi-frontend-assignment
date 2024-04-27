"use client";

import { faker } from "@faker-js/faker";
import { useEffect, useState } from "react";
import { z } from "zod";
import { columns } from "../_components/columns";
import { labels, priorities, statuses } from "../_constants/metadata";
import { taskSchema } from "../_constants/schema";

const generateData = () => {
    return Array.from({ length: 100 }, () => ({
        isSelected: true,
        id: `TASK-${faker.number.int({ min: 1000, max: 9999 })}`,
        title: faker.hacker.phrase().replace(/^./, (letter) => letter.toUpperCase()),
        status: faker.helpers.arrayElement(statuses).value,
        label: faker.helpers.arrayElement(labels).value,
        priority: faker.helpers.arrayElement(priorities).value,
    }));
};

export function useDataFetching() {
    const [data, setData] = useState<z.infer<typeof taskSchema>[]>([]);

    useEffect(() => {
        const generatedData = generateData();
        setData(generatedData);
    }, []);

    return {
        data: z.array(taskSchema).parse(data),
        columns: columns,
    };
}
