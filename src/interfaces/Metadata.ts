export interface Metadata {
  Id: number;
  Metadata?: {
    Thumbnail?: string;
    Title: string;
    Artist?: string;
    ReleaseDate?: Date;
    Genre?: string;
    Category?: string;
    Album?: string;
    Writers?: string;
    IsTopicMusic?: boolean;
    SongDuration?: string;
    Producer?: string;
    CoArtist?: string;
    RecordLabel?: string;
  };
  YoutubeLink?: string;
  FilePath?: string;
  FlagCount?: string;
  UnFlaggable?: string;
  CreatedBy?: string;
  CreatedAt?: string;
  DeletedBy?: string;
  DeletedAt?: string;
}
