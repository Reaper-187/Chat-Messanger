import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LogIn, MessageSquare, MoreHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FetchChatContext } from "@/Context/MessagesContext";
import { ChatContactsContext } from "@/Context/chatContactsContext";
import axios from "axios";
import { useAuth } from "@/Context/Auth-Context/Auth-Context";
axios.defaults.withCredentials = true;

const favoriteContactApi = import.meta.env.VITE_API_FAVORITECONTACT;

const getFavContactsApi = import.meta.env.VITE_API_FETCHFAVCONTACT;

export const columns = [
  {
    accessorKey: "avatar",
    cell: ({ row, table }) => {
      const { onlineStatus } = table.options.meta;
      const { _id, avatar } = row.original;

      const status = onlineStatus.find((user) => user._id === _id);
      const currentStatus = status?.isOnline ? "bg-green-600" : "bg-red-600";

      const avatarUrl = avatar?.startsWith("https://api.dicebear.com")
        ? avatar
        : `http://localhost:5000/${avatar}`;

      return (
        <div className="relative min-w-[90px]">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="rounded-full object-cover"
            width={30}
            height={30}
          />
          <p
            className={`absolute w-2 h-2 rounded-full left-7 bottom-0 ${currentStatus}`}
          ></p>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    cell: ({ row, table }) => {
      const { name, _id } = row.original;
      const { latestSortedChats } = table.options.meta;
      const lastMsg = latestSortedChats.find(
        (user) => user.to === _id || user.from === _id
      );
      return (
        <div className="lowercase truncate min-w-[130px] text-left">
          <p className="text-base truncate">{name}</p>
          <p className="text-xs text-gray-400 truncate">{lastMsg?.text}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const { handleFavoriteToggle } = table.options.meta;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleFavoriteToggle(row.original._id)}
            >
              <Star size={20} />
              Favorite
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>mute</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "unreadCount",
    cell: ({ row, table }) => {
      const { userGotNewMessage } = table.options.meta;
      const contactId = row.original._id;
      const unread = userGotNewMessage?.[contactId] || 0;

      return unread > 0 ? (
        <span className="flex items-center justify-center w-5 h-5 bg-green-500 text-black font-semibold rounded-full">
          {unread}
        </span>
      ) : null;
    },
  },
];

export function ChatlistTable() {
  const { userProfile } = useAuth();

  const { chatContacts } = useContext(ChatContactsContext);
  const { setSelectedUserId, userGotNewMessage, latestSortedChats } =
    useContext(FetchChatContext);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [onlineStatus, setOnlineStatus] = useState([]);
  const [favContacts, setFavContacts] = useState([]);

  useEffect(() => {
    const currentOnlineStatus = () => {
      const statusData = chatContacts?.map((contacts) => ({
        _id: contacts._id,
        isOnline: contacts.isOnline,
        avatar: contacts.avatar,
      }));
      setOnlineStatus(statusData);
    };
    currentOnlineStatus();
  }, [chatContacts]);

  const fetchFavContacts = async () => {
    try {
      const response = await axios.get(getFavContactsApi);
      const data = response.data.fetchFavContacts;
      const favContactsId = data.map((favId) => favId._id);
      setFavContacts(favContactsId);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (chatContacts.length > 0) {
      fetchFavContacts();
    }
  }, [chatContacts]);

  const handleFavoriteToggle = async (userId) => {
    try {
      await axios.post(favoriteContactApi, { _id: userId });
      await fetchFavContacts();
    } catch (err) {
      console.error("Error toggling favorite", err);
    }
  };

  const table = useReactTable({
    data: chatContacts,
    columns,
    meta: {
      userGotNewMessage,
      onlineStatus,
      handleFavoriteToggle,
      latestSortedChats,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const favoriteRows = useMemo(
    () =>
      table
        .getRowModel()
        .rows.filter((row) => favContacts.includes(row.original._id)),
    [table, favContacts]
  );

  const sortedIds = latestSortedChats.map((chat) =>
    chat.from === userProfile?._id ? chat.to : chat.from
  );

  const chatRows = useMemo(
    () =>
      table
        .getRowModel()
        .rows.filter((row) => !favContacts.includes(row.original._id))
        .sort(
          (a, b) =>
            sortedIds.indexOf(a.original._id) -
            sortedIds.indexOf(b.original._id)
        ),
    [table, favContacts, sortedIds]
  );

  return (
    <div className="w-full h-full border-r-1 px-1">
      {/* favorite table */}
      <div className="border-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="flex items-center">
                <Star size={20} className="mr-3" />
                Favorites
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {favoriteRows.length ? (
              favoriteRows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => setSelectedUserId(row.original._id)}
                  className="border-none hover:bg-[#ffffff1a] cursor-pointer transition-all druation-300"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-10 text-center"
                >
                  No favorites.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="border-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="flex items-center">
                <MessageSquare size={20} className="mr-3" />
                Chats
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chatRows.length ? (
              chatRows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => setSelectedUserId(row.original._id)}
                  className="border-none hover:bg-[#ffffff1a] cursor-pointer transition-all druation-300"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-10 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
