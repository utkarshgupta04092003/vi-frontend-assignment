"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    ColumnResizeDirection,
    ColumnResizeMode,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DataTablePagination } from "./data-table-pagination";
import { useEffect, useState } from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {

    const [rowSelection, setRowSelection] = useState({})

    // check which row is selected currently
    // useEffect(()=>{
    //     console.log(rowSelection);
    // }, [rowSelection]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        // select row features
        state: {
            rowSelection: rowSelection
        },
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        enableMultiRowSelection: false,
        // column resize features
        columnResizeMode: 'onChange',
        columnResizeDirection: 'ltr',
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,

    });

    // TASK : Make first 2 columns (i.e. checkbox and task id) sticky
    // TASK : Make header columns resizable
    

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table {...{
                    className: 'border border-gray-200',
                    style: {
                        width: table.getCenterTotalSize(),
                    },
                }}>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead {...{
                                            key: header.id,
                                            colSpan: header.colSpan,
                                            style: {
                                                width: header.getSize(),
                                            },
                                        }}>
                                            <div className="flex justify-between">

                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                    
                                                )}
                                            <div
                                                {...{
                                                    onDoubleClick: () => header.column.resetSize(),
                                                    onMouseDown: header.getResizeHandler(),
                                                    onTouchStart: header.getResizeHandler(),
                                                    className: `resizer ${table.options.columnResizeDirection
                                                        } ${header.column.getIsResizing() ? 'isResizing' : ''
                                                    }flex cursor-col-resize border-2 border-gray-600`,
                                                    style: {
                                                        transform:
                                                        table.options.columnResizeMode === 'onEnd' &&
                                                        header.column.getIsResizing()
                                                        ? `translateX(${(table.options.columnResizeDirection ===
                                                            'rtl'
                                                            ? -1
                                                            : 1) *
                                                            (table.getState().columnSizingInfo
                                                            .deltaOffset ?? 0)
                                                        }px)`
                                                        : '',
                                                    },
                                                }}
                                                ></div>
                                                </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell {...{
                                            key: cell.id,
                                            style: {
                                              width: cell.column.getSize(),
                                            },
                                          }} >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
