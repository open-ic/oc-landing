import type {
    AddedToGroupNotification,
    DirectNotification,
    DirectReaction,
    GroupNotification,
    GroupReaction,
    Notification,
} from "../../domain/notifications";
import { message } from "../common/chatMappers";
import type {
    ApiAddedToGroupNotification,
    ApiDirectMessageNotification,
    ApiDirectReactionAddedNotification,
    ApiGroupMessageNotification,
    ApiGroupReactionAddedNotification,
    ApiNotification,
} from "./candid/idl";
import { identity, optional } from "../../utils/mapping";

export function notification(candid: ApiNotification): Notification {
    if ("AddedToGroupNotification" in candid) {
        return addedToGroupNotification(candid.AddedToGroupNotification);
    }
    if ("GroupMessageNotification" in candid) {
        return groupNotification(candid.GroupMessageNotification);
    }
    if ("DirectMessageNotification" in candid) {
        return directNotification(candid.DirectMessageNotification);
    }
    if ("GroupReactionAddedNotification" in candid) {
        return groupReactionNotification(candid.GroupReactionAddedNotification);
    }
    if ("DirectReactionAddedNotification" in candid) {
        return directReactionNotification(candid.DirectReactionAddedNotification);
    }
    throw new Error(`Unexpected ApiNotification type received, ${candid}`);
}

export function addedToGroupNotification(
    candid: ApiAddedToGroupNotification
): AddedToGroupNotification {
    return {
        kind: "added_to_group_notification",
        chatId: candid.chat_id.toString(),
        groupName: candid.group_name,
        addedBy: candid.added_by.toString(),
        addedByUsername: candid.added_by_name,
        timestamp: candid.timestamp,
    };
}

export function groupNotification(candid: ApiGroupMessageNotification): GroupNotification {
    return {
        kind: "group_notification",
        sender: candid.sender.toString(),
        threadRootMessageIndex: optional(candid.thread_root_message_index, identity),
        message: {
            index: candid.message.index,
            timestamp: candid.message.timestamp,
            event: message(candid.message.event),
        },
        senderName: candid.sender_name,
        chatId: candid.chat_id.toString(),
        groupName: candid.group_name,
        mentioned: candid.mentioned.map((m) => ({
            userId: m.user_id.toText(),
            username: m.username,
        })),
    };
}

export function directNotification(candid: ApiDirectMessageNotification): DirectNotification {
    return {
        kind: "direct_notification",
        sender: candid.sender.toString(),
        threadRootMessageIndex: optional(candid.thread_root_message_index, identity),
        message: {
            index: candid.message.index,
            timestamp: candid.message.timestamp,
            event: message(candid.message.event),
        },
        senderName: candid.sender_name,
    };
}

function groupReactionNotification(candid: ApiGroupReactionAddedNotification): GroupReaction {
    return {
        kind: "group_reaction",
        chatId: candid.chat_id.toString(),
        threadRootMessageIndex: optional(candid.thread_root_message_index, identity),
        groupName: candid.group_name,
        addedBy: candid.added_by.toString(),
        addedByName: candid.added_by_name,
        message: {
            index: candid.message.index,
            timestamp: candid.message.timestamp,
            event: message(candid.message.event),
        },
        reaction: candid.reaction,
        timestamp: candid.timestamp,
    };
}

function directReactionNotification(candid: ApiDirectReactionAddedNotification): DirectReaction {
    return {
        kind: "direct_reaction",
        them: candid.them.toString(),
        username: candid.username,
        message: {
            index: candid.message.index,
            timestamp: candid.message.timestamp,
            event: message(candid.message.event),
        },
        reaction: candid.reaction,
        timestamp: candid.timestamp,
    };
}
