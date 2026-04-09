import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Template } from "@/api/entities";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

export default function AddTemplateModal({ onClose, onSuccess, template }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!template;

  const { data: scenarios = [] } = useQuery({
    queryKey: ['template-scenarios'],
    queryFn: () => Template.getScenarios(),
  });

  const scenarioOptions = React.useMemo(() => {
    const baseOptions = [
      { value: "general", label: "General" },
      { value: "choosing", label: "Choosing" },
      { value: "daily", label: "Daily" },
      { value: "recommendation", label: "Recommendation" },
    ];
    const seenLower = new Set(baseOptions.map((o) => o.value.toLowerCase()));
    const dynamic = [];
    for (const s of scenarios || []) {
      if (!s || seenLower.has(String(s).toLowerCase())) continue;
      seenLower.add(String(s).toLowerCase());
      dynamic.push({ value: s, label: s });
    }
    return [
      ...baseOptions,
      ...dynamic,
      { value: "__custom__", label: "Add new scenario…" },
    ];
  }, [scenarios]);

  const [formData, setFormData] = useState({
    title: template?.title || "",
    scenario: template?.scenario || "general",
    prompt_text: template?.prompt_text || "",
    email_subject: template?.email_subject || "",
    email_body: template?.email_body || "",
    active: template?.active ?? true,
  });

  const [customScenario, setCustomScenario] = useState("");

  const templateMutation = useMutation({
    mutationFn: (data) =>
      isEditMode
        ? Template.update(template.id, data)
        : Template.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({ queryKey: ['template-scenarios'] });
      toast({
        title: `Template ${isEditMode ? 'updated' : 'created'} successfully`,
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      scenario:
        formData.scenario === "__custom__" && customScenario.trim()
          ? customScenario.trim()
          : formData.scenario,
    };
    templateMutation.mutate(payload);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Template" : "Add New Template"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Template title"
                required
              />
            </div>

            {/* Scenario */}
            <div className="space-y-2">
              <Label htmlFor="scenario">Scenario *</Label>
              <Select
                value={formData.scenario}
                onValueChange={(value) => {
                  if (value === "__custom__") {
                    setFormData((prev) => ({ ...prev, scenario: "__custom__" }));
                  } else {
                    setFormData((prev) => ({ ...prev, scenario: value }));
                    setCustomScenario("");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a scenario" />
                </SelectTrigger>
                <SelectContent>
                  {scenarioOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.scenario === "__custom__" && (
                <div className="pt-2">
                  <Input
                    id="custom_scenario"
                    name="custom_scenario"
                    value={customScenario}
                    onChange={(e) => setCustomScenario(e.target.value)}
                    placeholder="Type a new scenario name"
                    required
                  />
                </div>
              )}
            </div>

            {/* Prompt Text */}
            <div className="space-y-2">
              <Label htmlFor="prompt_text">Prompt Text *</Label>
              <Textarea
                id="prompt_text"
                name="prompt_text"
                value={formData.prompt_text}
                onChange={handleChange}
                placeholder="Enter the prompt text that will be shown to users"
                rows={3}
                required
              />
            </div>

            {/* Email Subject */}
            <div className="space-y-2">
              <Label htmlFor="email_subject">Email Subject *</Label>
              <Input
                id="email_subject"
                name="email_subject"
                value={formData.email_subject}
                onChange={handleChange}
                placeholder="Email subject line"
                required
              />
            </div>

            {/* Email Body */}
            <div className="space-y-2">
              <Label htmlFor="email_body">Email Body *</Label>
              <Textarea
                id="email_body"
                name="email_body"
                value={formData.email_body}
                onChange={handleChange}
                placeholder="Enter the email body content"
                rows={5}
                className="font-mono text-sm"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use these placeholders; they will be replaced with actual data: <br /><span className="font-mono bg-muted px-1 rounded text-[#0BC5EA]">[Parent Name]</span> <span className="font-mono bg-muted px-1 rounded text-[#0BC5EA]">[Child Name]</span> <span className="font-mono bg-muted px-1 rounded text-[#0BC5EA]">[Center Name]</span>
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="active">Active</Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, active: checked }))
                }
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={templateMutation.isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={templateMutation.isLoading}>
              {templateMutation.isLoading
                ? "Saving..."
                : isEditMode
                  ? "Update Template"
                  : "Create Template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog >
  );
}