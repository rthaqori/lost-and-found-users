import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useInView } from "react-intersection-observer";
import {
  useLostItems,
  useLikeItem,
  useUnlikeItem,
  useShareItem,
  useFlagItem,
  useDeleteItem,
} from "@/hooks/useLostItems";
import {
  useGetComments,
  useAddComment,
  useAddReply,
  useLikeComment,
  useUnlikeComment,
  useDeleteComment,
  useFlagComment,
} from "@/hooks/useComments";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  Share2,
  Flag,
  Bookmark,
  MoreHorizontal,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
  AlertTriangle,
  Search,
  Filter,
  MapPin,
  Clock,
  User,
  Award,
  Eye,
  ChevronDown,
  ChevronUp,
  Copy,
  Plus,
  ShieldCheck,
  Bell,
  Package,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type {
  LostItem,
  FlagReason as LostItemFlagReason,
} from "@/types/lostItem.types";
import type {
  Comment,
  FlagReason as CommentFlagReason,
} from "@/types/comment.types";
import { Link } from "react-router-dom";

// HELPER FUNCTIONS

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (date: string) => {
  const now = new Date();
  const target = new Date(date);
  const diffInHours = (now.getTime() - target.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return `${Math.floor(diffInHours * 60)}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return formatDistanceToNow(target, { addSuffix: true });
  }
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

// IMAGE CAROUSEL COMPONENT

interface CarouselImage {
  url: string;
  isPrimary?: boolean;
}

const EnhancedImageCarousel = ({ images }: { images: CarouselImage[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="group relative">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800">
          <img
            src={images[currentIndex].url}
            alt=""
            className="h-full w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
            onClick={() => setIsFullscreen(true)}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-black/80"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-black/80"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      currentIndex === idx
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/50",
                    )}
                  />
                ))}
              </div>
              <div className="absolute top-3 right-3 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                {currentIndex + 1}/{images.length}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="h-[95vh] max-w-[95vw] border-0 bg-black p-0">
          <div className="relative flex h-full w-full items-center justify-center">
            <img
              src={images[currentIndex].url}
              alt=""
              className="max-h-full max-w-full object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/70"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/70"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// COMMENT COMPONENT

interface CommentItemProps {
  comment: Comment;
  itemId: string;
  currentUserId: string;
  currentUserName: string;
  onLike: (commentId: string) => void;
  onUnlike: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onReply: (parentCommentId: string, content: string) => void;
  onFlag: (commentId: string, reason: CommentFlagReason) => void;
  level?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  itemId,
  currentUserId,
  currentUserName,
  onLike,
  onUnlike,
  onDelete,
  onReply,
  onFlag,
  level = 0,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isLiked, setIsLiked] = useState(
    comment.likes?.includes(currentUserId) || false,
  );
  const [showReplies, setShowReplies] = useState(false);
  const [showFlagDialog, setShowFlagDialog] = useState(false);

  const isOwner = comment.userId._id === currentUserId;

  const handleLike = () => {
    if (isLiked) {
      onUnlike(comment._id);
      setIsLiked(false);
    } else {
      onLike(comment._id);
      setIsLiked(true);
    }
  };

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment._id, replyContent);
      setReplyContent("");
      setShowReplyForm(false);
    }
  };

  const handleFlag = (reason: CommentFlagReason) => {
    onFlag(comment._id, reason);
    setShowFlagDialog(false);
  };

  const renderContent = () => {
    let parts = [];
    let lastIndex = 0;
    const mentions = comment.mentions || [];
    const allMarkers = [...mentions];

    allMarkers.sort((a, b) => a.indices[0] - b.indices[0]);

    for (const mention of allMarkers) {
      if (mention.indices[0] > lastIndex) {
        parts.push(comment.content.slice(lastIndex, mention.indices[0]));
      }
      parts.push(
        <span
          key={`mention-${mention.userId._id}`}
          className="font-medium text-blue-600"
        >
          @{mention.username}
        </span>,
      );
      lastIndex = mention.indices[1];
    }
    if (lastIndex < comment.content.length) {
      parts.push(comment.content.slice(lastIndex));
    }

    return parts;
  };

  const flagReasons: CommentFlagReason[] = [
    "spam",
    "harassment",
    "hate_speech",
    "inappropriate",
    "other",
  ];

  return (
    <div className={cn("flex gap-3", level > 0 && "ml-12")}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        {comment.userId.avatar ? (
          <AvatarImage src={comment.userId.avatar} />
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-xs text-white">
            {getInitials(comment.userId.name)}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "rounded-2xl p-3",
            level === 0 ? "bg-gray-50" : "bg-gray-100",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">
                {comment.userId.name}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(comment.createdAt)}
              </span>
              {comment.isEdited && (
                <span className="text-xs text-gray-400">• edited</span>
              )}
              {comment.isPinned && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-xs text-yellow-700"
                >
                  <Award className="mr-1 h-3 w-3" />
                  Pinned
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {isOwner && (
                    <DropdownMenuItem
                      onClick={() => onDelete(comment._id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                  {!isOwner && (
                    <DropdownMenuItem onClick={() => setShowFlagDialog(true)}>
                      <Flag className="mr-2 h-4 w-4" />
                      Report
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className="mt-1 text-sm break-words whitespace-pre-wrap text-gray-700">
            {renderContent()}
          </p>
        </div>
        <div className="mt-1 ml-2 flex gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-red-500"
                >
                  <Heart
                    className={cn(
                      "h-3.5 w-3.5",
                      isLiked && "fill-red-500 text-red-500",
                    )}
                  />
                  <span>
                    {comment.likesCount > 0
                      ? formatNumber(comment.likesCount)
                      : ""}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>{isLiked ? "Unlike" : "Like"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-blue-500"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Reply</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Reply</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {comment.replyCount > 0 && !showReplies && (
            <button
              onClick={() => setShowReplies(true)}
              className="text-xs text-blue-500 hover:underline"
            >
              View {comment.replyCount}{" "}
              {comment.replyCount === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>

        {showReplyForm && (
          <div className="mt-3 flex gap-2">
            <Input
              placeholder={`Reply to ${comment.userId.name}...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReply()}
              className="flex-1 text-sm"
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleReply}
              disabled={!replyContent.trim()}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                itemId={itemId}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                onLike={onLike}
                onUnlike={onUnlike}
                onDelete={onDelete}
                onReply={onReply}
                onFlag={onFlag}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Flag Dialog */}
      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report Comment</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {flagReasons.map((reason) => (
              <Button
                key={reason}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleFlag(reason)}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                {reason.charAt(0).toUpperCase() +
                  reason.slice(1).replace("_", " ")}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// COMMENTS SECTION

interface CommentsSectionProps {
  itemId: string;
  currentUserId: string;
  currentUserName: string;
  onCommentAdded?: () => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  itemId,
  currentUserId,
  currentUserName,
  onCommentAdded,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    data: commentsData,
    isLoading,
    refetch,
  } = useGetComments(itemId, {
    page: 1,
    limit: isExpanded ? 50 : 3,
    sort: "latest",
    includeReplies: true,
  });

  const addComment = useAddComment();
  const addReply = useAddReply();
  const likeComment = useLikeComment();
  const unlikeComment = useUnlikeComment();
  const deleteComment = useDeleteComment();
  const flagComment = useFlagComment();

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addComment.mutateAsync({
        itemId,
        data: { content: newComment },
      });
      setNewComment("");
      refetch();
      onCommentAdded?.();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleAddReply = async (parentCommentId: string, content: string) => {
    try {
      await addReply.mutateAsync({
        itemId,
        parentCommentId,
        content,
      });
      refetch();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleLikeComment = async (commentId: string) => {
    await likeComment.mutateAsync(commentId);
    refetch();
  };

  const handleUnlikeComment = async (commentId: string) => {
    await unlikeComment.mutateAsync(commentId);
    refetch();
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment.mutateAsync(commentId);
    refetch();
  };

  const handleFlagComment = async (
    commentId: string,
    reason: CommentFlagReason,
  ) => {
    await flagComment.mutateAsync({ commentId, data: { reason } });
  };

  const comments = commentsData?.data || [];
  const totalComments = commentsData?.pagination.total || 0;

  if (isLoading) {
    return (
      <div className="mt-4 space-y-4">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  const displayedComments = isExpanded ? comments : comments.slice(0, 3);

  return (
    <div className="mt-4 border-t pt-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            {totalComments} {totalComments === 1 ? "Comment" : "Comments"}
          </span>
        </div>
        {totalComments > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500"
          >
            {isExpanded ? (
              <ChevronUp className="mr-1 h-4 w-4" />
            ) : (
              <ChevronDown className="mr-1 h-4 w-4" />
            )}
            {isExpanded ? "Show less" : "Show all"}
          </Button>
        )}
      </div>

      <div className="mb-4 flex gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
            {getInitials(currentUserName)}
          </AvatarFallback>
        </Avatar>
        <div className="relative flex-1">
          <Input
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            className="rounded-full bg-gray-50 pr-12"
          />
          <Button
            size="sm"
            onClick={handleAddComment}
            disabled={!newComment.trim() || addComment.isPending}
            className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 rounded-full p-0"
          >
            {addComment.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {displayedComments.length > 0 ? (
        <div className="space-y-4">
          {displayedComments.map((comment, index) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              itemId={itemId}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              onLike={handleLikeComment}
              onUnlike={handleUnlikeComment}
              onDelete={handleDeleteComment}
              onReply={handleAddReply}
              onFlag={handleFlagComment}
            />
          ))}
          {!isExpanded && totalComments > 3 && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm font-medium text-blue-500 hover:text-blue-600"
            >
              View all {totalComments} comments
            </button>
          )}
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-gray-500">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
};

// POST COMPONENT

interface PostProps {
  item: LostItem;
  currentUserId: string;
  currentUserName: string;
  isAdmin: boolean;
}

const Post: React.FC<PostProps> = ({
  item,
  currentUserId,
  currentUserName,
  isAdmin,
}) => {
  const [isLiked, setIsLiked] = useState(
    item.likes?.some((like) => like.user === currentUserId) || false,
  );
  const [showComments, setShowComments] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const likeItem = useLikeItem();
  const unlikeItem = useUnlikeItem();
  const shareItem = useShareItem();
  const flagItem = useFlagItem();
  const deleteItem = useDeleteItem();

  const isOwner = item.reportedBy._id === currentUserId;
  const descriptionLength = item.description?.length || 0;
  const needsTruncate = descriptionLength > 150;
  const displayDescription = showFullDescription
    ? item.description
    : item.description?.slice(0, 150);

  const handleLike = async () => {
    if (isLiked) {
      await unlikeItem.mutateAsync(item._id);
      setIsLiked(false);
    } else {
      await likeItem.mutateAsync(item._id);
      setIsLiked(true);
    }
  };

  const handleShare = async (platform: string) => {
    await shareItem.mutateAsync({
      id: item._id,
      data: { sharedOn: platform as any },
    });
    setShowShareDialog(false);
  };

  const handleFlag = async (
    reason: LostItemFlagReason,
    description?: string,
  ) => {
    await flagItem.mutateAsync({ id: item._id, data: { reason, description } });
  };

  const handleDelete = async () => {
    await deleteItem.mutateAsync(item._id);
    setShowDeleteDialog(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${item._id}`);
    toast.success("Link copied to clipboard!");
  };

  const flagReasons: LostItemFlagReason[] = [
    "inappropriate",
    "spam",
    "fake",
    "duplicate",
    "other",
  ];

  return (
    <div className="mb-5 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Post Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 shadow-md ring-2 ring-white">
              {item.reportedBy.avatar ? (
                <AvatarImage src={item.reportedBy.avatar} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-base text-white">
                  {getInitials(item.reportedBy.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-semibold">
                  {item.reportedBy.name}
                </span>
                {item.isVerified && (
                  <Badge
                    variant="secondary"
                    className="gap-1 bg-blue-50 text-xs text-blue-600"
                  >
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
                <Badge
                  className={cn(
                    "text-xs",
                    item.status === "lost"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600",
                  )}
                >
                  {item.status === "lost" ? "Lost" : "Found"}
                </Badge>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{item.locationDescription}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(item.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="h-5 w-5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {(isOwner || isAdmin) && (
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
              {!isOwner && (
                <DropdownMenuItem onClick={() => setShowFlagDialog(true)}>
                  <Flag className="mr-2 h-4 w-4" />
                  Report
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={copyLink}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-3">
          <Link to={`/${item._id}`} className="mt-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {item.itemName}
            </h2>
          </Link>
          <div className="mt-2 leading-relaxed text-gray-600">
            <p>
              {displayDescription}
              {needsTruncate && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="ml-1 text-sm font-medium text-blue-500 hover:text-blue-600"
                >
                  {showFullDescription ? "Show less" : "... See more"}
                </button>
              )}
            </p>
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-gray-50 text-xs"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Images */}
      {item.images && item.images.length > 0 && (
        <div className="px-5 pb-3">
          <EnhancedImageCarousel images={item.images} />
        </div>
      )}

      {/* Stats Bar */}
      <div className="flex items-center justify-between px-5 py-2 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <span>{formatNumber(item.likesCount)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{formatNumber(item.commentsCount)} comments</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{formatNumber(item.views)} views</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-b border-gray-100 px-5 py-2">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={cn(
                    "gap-2 rounded-full",
                    isLiked && "text-red-500",
                  )}
                >
                  <Heart className={cn("h-5 w-5", isLiked && "fill-red-500")} />
                  <span>Like</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isLiked ? "Unlike" : "Like"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowComments(!showComments)}
                  className="gap-2 rounded-full"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Comment</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Comment</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowShareDialog(true)}
                  className="gap-2 rounded-full"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSaved(!isSaved)}
                className="rounded-full"
              >
                <Bookmark
                  className={cn(
                    "h-5 w-5",
                    isSaved && "fill-yellow-500 text-yellow-500",
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isSaved ? "Saved" : "Save"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-5 pb-4">
          <CommentsSection
            itemId={item._id}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            onCommentAdded={() => {}}
          />
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>
          <div className="mt-4 flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share "{item.itemName}"</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {[
              { platform: "timeline", icon: "📱", label: "Share to Timeline" },
              { platform: "message", icon: "💬", label: "Share via Message" },
              { platform: "whatsapp", icon: "📱", label: "Share to WhatsApp" },
            ].map((option) => (
              <Button
                key={option.platform}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleShare(option.platform)}
              >
                <span className="mr-3 text-xl">{option.icon}</span>
                {option.label}
              </Button>
            ))}
            <Separator />
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={copyLink}
            >
              <span className="mr-3">🔗</span>
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Flag Dialog */}
      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {flagReasons.map((reason) => (
              <Button
                key={reason}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleFlag(reason)}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                {reason.charAt(0).toUpperCase() + reason.slice(1)}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// FILTER BAR

interface FilterBarProps {
  activeStatus: "lost" | "found" | undefined;
  onStatusChange: (status: "lost" | "found" | undefined) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  activeCategory: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  activeStatus,
  onStatusChange,
  onSearch,
  searchQuery,
  onCategoryChange,
  categories,
  activeCategory,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by name, description, or tags..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="rounded-full bg-gray-50 pr-10 pl-10"
        />
        {searchQuery && (
          <button
            onClick={() => onSearch("")}
            className="absolute top-1/2 right-3 -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      <div className="mt-4">
        <Tabs
          defaultValue="all"
          value={activeStatus || "all"}
          onValueChange={(v) =>
            onStatusChange(v === "all" ? undefined : (v as "lost" | "found"))
          }
        >
          <TabsList className="grid w-full grid-cols-3 rounded-xl bg-gray-100 p-1">
            <TabsTrigger
              value="all"
              className="rounded-lg data-[state=active]:bg-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="lost"
              className="rounded-lg data-[state=active]:bg-white"
            >
              Lost
            </TabsTrigger>
            <TabsTrigger
              value="found"
              className="rounded-lg data-[state=active]:bg-white"
            >
              Found
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-gray-600"
        >
          <Filter className="h-4 w-4" />
          <span>Categories</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-180",
            )}
          />
        </button>

        {isExpanded && (
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge
              className={cn(
                "cursor-pointer px-3 py-1 text-sm",
                !activeCategory && "bg-blue-500 text-white",
              )}
              onClick={() => onCategoryChange("")}
            >
              All
            </Badge>
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                className={cn(
                  "cursor-pointer px-3 py-1 text-sm",
                  activeCategory === cat && "bg-blue-500 text-white",
                )}
                onClick={() => onCategoryChange(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// NAVBAR

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg transition-shadow",
        isScrolled && "shadow-md",
      )}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
            <Award className="h-6 w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
            Lost & Found
          </span>
        </div>

        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Bell className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-full p-0"
              >
                <Avatar className="h-9 w-9">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {getInitials(user.name || user.email)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="hidden text-sm font-medium md:inline">
                  {user.name}
                </span>
                <ChevronDown className="hidden h-4 w-4 md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => (window.location.href = "/profile")}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => (window.location.href = "/my-items")}
              >
                <Package className="mr-2 h-4 w-4" />
                My Items
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

// LOADING SKELETON

const PostSkeleton = () => (
  <div className="mb-5 overflow-hidden rounded-2xl border border-gray-100 bg-white">
    <div className="p-5 pb-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="mb-1 h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="mt-3">
        <Skeleton className="mb-2 h-6 w-48" />
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
    <Skeleton className="h-[400px] w-full" />
    <div className="px-5 py-3">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  </div>
);

// EMPTY STATE

const EmptyState = () => (
  <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center">
    <div className="mb-4 text-7xl">📭</div>
    <h3 className="text-lg font-semibold text-gray-700">No posts yet</h3>
    <p className="mt-1 text-gray-500">
      Be the first to share a lost or found item!
    </p>
    <Button
      onClick={() => (window.location.href = "/create-post")}
      className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500"
    >
      <Plus className="mr-2 h-4 w-4" />
      Create Post
    </Button>
  </div>
);

// MAIN FEED COMPONENT

export const Feed = () => {
  const { user, logout } = useAuth();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"lost" | "found" | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { ref, inView } = useInView({ threshold: 0.1 });

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Accessories",
    "Documents",
    "Keys",
    "Wallets",
    "Bags",
    "Mobile Phones",
    "Laptops",
    "ID Cards",
  ];

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isFetching } = useLostItems({
    collegeId: user?.college?.id || "",
    page,
    limit: 10,
    status,
    category: activeCategory || undefined,
    search: debouncedSearch || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Infinite scroll - load more when scrolling
  useEffect(() => {
    if (
      inView &&
      data?.pagination &&
      page < data.pagination.pages &&
      !isFetching
    ) {
      setPage((prev) => prev + 1);
    }
  }, [inView, data?.pagination, page, isFetching]);

  const items = data?.data || [];
  const totalItems = data?.pagination.total || 0;

  const handleLogout = async () => {
    await logout();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Floating Create Post Button */}
        <div className="fixed right-6 bottom-6 z-40">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => (window.location.href = "/create-post")}
                  className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
                >
                  <Plus className="h-6 w-6 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create new post</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Filter Bar */}
        <FilterBar
          activeStatus={status}
          onStatusChange={setStatus}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
          onCategoryChange={setActiveCategory}
          categories={categories}
          activeCategory={activeCategory}
        />

        {/* Stats Summary */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-gray-100 bg-white p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(totalItems)}
            </div>
            <div className="text-xs text-gray-500">Total Posts</div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-red-500">
              {formatNumber(items.filter((i) => i.status === "lost").length)}
            </div>
            <div className="text-xs text-gray-500">Lost Items</div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-500">
              {formatNumber(items.filter((i) => i.status === "found").length)}
            </div>
            <div className="text-xs text-gray-500">Found Items</div>
          </div>
        </div>

        {/* Posts */}
        {isLoading && page === 1 ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {items.map((item) => (
              <Post
                key={item._id}
                item={item}
                currentUserId={user.id}
                currentUserName={user.name}
                isAdmin={user.role === "college_admin"}
              />
            ))}
          </>
        )}

        {/* Load More Trigger */}
        {data?.pagination && page < data.pagination.pages && (
          <div ref={ref} className="flex justify-center py-4">
            {isFetching && (
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            )}
          </div>
        )}

        {(!data?.pagination || page >= data.pagination.pages) &&
          items.length > 0 && (
            <p className="py-6 text-center text-sm text-gray-400">
              You've reached the end! 🎉
            </p>
          )}
      </div>
    </div>
  );
};

export default Feed;
