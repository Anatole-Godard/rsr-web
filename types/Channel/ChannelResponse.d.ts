import {Channel} from "@definitions/Channel/Channel";

type ChannelResponse =
    | {
    channel: Channel;
}
    | { error: {
        code: number,
        message: string
    } };