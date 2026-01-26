import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload, Image as ImageIcon, Video, Copy, Trash2,
  Search, FileImage, FileVideo, Eye, X
} from "lucide-react";
import { toast } from "sonner";

interface Asset {
  id: string;
  name: string;
  asset_type: "image" | "video" | "gif";
  file_url: string;
  size_mb: number;
  created_at: string;
}

const API_BASE_URL = "http://127.0.0.1:8000/api/v1/assets/";

const AssetManager = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [totalMemory, setTotalMemory] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();

      // Handle DRF Pagination results wrapper
      let rawAssets = [];
      if (data.assets?.results && Array.isArray(data.assets.results)) {
        rawAssets = data.assets.results;
      } else if (Array.isArray(data.assets)) {
        rawAssets = data.assets;
      }

      setAssets(rawAssets);
      setTotalMemory(data.total_memory_utilisation_mb || 0);
    } catch (error) {
      toast.error("Failed to load assets");
      setAssets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAssets(); }, []);

  // Filter based on Search Input
  const filteredAssets = useMemo(() => {
    return (assets || []).filter(a =>
      a.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [assets, searchQuery]);

  const handleFiles = async (files: FileList) => {
    const toastId = toast.loading("Uploading files...");
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", file.name);

        const res = await fetch(API_BASE_URL, { method: "POST", body: formData });
        if (!res.ok) throw new Error(`Failed to upload ${file.name}`);
      }
      toast.success("All files uploaded", { id: toastId });
      fetchAssets();
    } catch (err) {
      toast.error("Upload failed", { id: toastId });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const deleteAsset = async (id: string) => {
    if (!confirm("Delete this asset permanently?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}${id}/`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Asset deleted");
        fetchAssets();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const AssetGrid = ({ items }: { items: Asset[] }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((asset) => (
        <Card key={asset.id} className="overflow-hidden group border-muted">
          <div className="aspect-video bg-muted relative">
            {asset.asset_type === "video" ? (
              <div className="flex items-center justify-center h-full bg-slate-200">
                <FileVideo className="h-8 w-8 text-slate-500" />
              </div>
            ) : (
              <img src={asset.file_url} className="w-full h-full object-cover" alt={asset.name} />
            )}

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all duration-200">
              <Button size="icon" variant="secondary" onClick={() => setSelectedAsset(asset)} title="View">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" onClick={() => copyUrl(asset.file_url)} title="Copy URL">
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="destructive" onClick={() => deleteAsset(asset.id)} title="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Badge className="absolute top-1 left-1 text-[10px] uppercase pointer-events-none">
              {asset.asset_type}
            </Badge>
          </div>
          <div className="p-2 space-y-1">
            <p className="text-[11px] font-medium truncate" title={asset.name}>{asset.name}</p>
            <p className="text-[10px] text-muted-foreground">{asset.size_mb} MB</p>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asset Manager</h1>
          <p className="text-muted-foreground">Manage and track your media storage.</p>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-lg border text-right">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Usage</p>
          <p className="text-xl font-bold text-primary">{totalMemory} MB</p>
        </div>
      </div>

      {/* Upload Zone */}
      <Card className="border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
        <CardContent className="py-10">
          <input
            type="file" multiple id="file-up" className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <label htmlFor="file-up" className="flex flex-col items-center cursor-pointer">
            <Upload className="h-10 w-10 text-primary mb-3" />
            <span className="font-medium">Click to upload or drag files here</span>
            <span className="text-xs text-muted-foreground mt-1">Images, Videos, GIFs</span>
          </label>
        </CardContent>
      </Card>

      {/* Toolbar & Content */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all">All Assets</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
            <TabsTrigger value="gif">GIFs</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="all">
              <AssetGrid items={filteredAssets} />
            </TabsContent>
            <TabsContent value="image">
              <AssetGrid items={filteredAssets.filter(a => a.asset_type === 'image')} />
            </TabsContent>
            <TabsContent value="video">
              <AssetGrid items={filteredAssets.filter(a => a.asset_type === 'video')} />
            </TabsContent>
            <TabsContent value="gif">
              <AssetGrid items={filteredAssets.filter(a => a.asset_type === 'gif')} />
            </TabsContent>
          </div>
        </Tabs>

        {filteredAssets.length === 0 && !isLoading && (
          <div className="text-center py-20 bg-slate-50 border rounded-xl">
            <p className="text-muted-foreground">No assets found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Full Preview Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedAsset(null)}>
          <div className="bg-background rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <Button size="icon" variant="ghost" className="absolute right-4 top-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full" onClick={() => setSelectedAsset(null)}>
              <X className="h-5 w-5" />
            </Button>

            <div className="bg-slate-900 flex items-center justify-center min-h-[300px] max-h-[70vh]">
              {selectedAsset.asset_type === 'video' ? (
                <video src={selectedAsset.file_url} controls className="max-w-full max-h-full" autoPlay />
              ) : (
                <img src={selectedAsset.file_url} className="max-w-full max-h-full object-contain" alt="" />
              )}
            </div>

            <div className="p-6 flex justify-between items-center bg-card">
              <div>
                <h3 className="font-bold text-lg">{selectedAsset.name}</h3>
                <p className="text-sm text-muted-foreground">Original File URL: <span className="underline break-all">{selectedAsset.file_url}</span></p>
              </div>
              <Button onClick={() => copyUrl(selectedAsset.file_url)} className="shrink-0">
                <Copy className="mr-2 h-4 w-4" /> Copy Direct Link
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManager;