'use client';

/**
 * Google Integrations Client Component.
 * Renders three professional cards for Analytics, Search Console, and Google Ads.
 * Handles connect/disconnect/refresh flows with loading states.
 */
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Globe,
  Loader2,
  Megaphone,
  RefreshCw,
  Unplug,
  XCircle,
  Info,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState, useTransition } from 'react';

import type { GoogleIntegrationInfo, GoogleService } from '@/features/google-integrations/types';
import {
  initiateOAuthConnection,
  disconnectIntegration,
  refreshIntegration,
} from '@/features/google-integrations';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  integrations: GoogleIntegrationInfo[];
  oauthConfigured: boolean;
  configStatus: {
    configured: boolean;
    hasClientId: boolean;
    hasClientSecret: boolean;
    hasEncryptionKey: boolean;
    hasAdsDevToken: boolean;
  };
}

interface StatusMeta {
  label: string;
  color: string;
  icon: React.ReactNode;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getStatusDisplay(status: string | undefined): StatusMeta {
  switch (status) {
    case 'connected':
      return {
        label: 'Connected',
        color: 'text-green-700 bg-green-50 border-green-200',
        icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
      };
    case 'error':
      return {
        label: 'Error',
        color: 'text-red-700 bg-red-50 border-red-200',
        icon: <XCircle className="h-4 w-4 text-red-600" />,
      };
    case 'partially_configured':
      return {
        label: 'Partially Configured',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
      };
    default:
      return {
        label: 'Not Connected',
        color: 'text-gray-600 bg-gray-50 border-gray-200',
        icon: <Unplug className="h-4 w-4 text-gray-400" />,
      };
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  return new Date(dateStr).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function GoogleIntegrationsClient({ integrations, oauthConfigured, configStatus }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [loadingService, setLoadingService] = useState<GoogleService | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Show notification from URL params (OAuth callback results)
  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    if (success === 'true' && message) {
      setNotification({ type: 'success', message: decodeURIComponent(message) });
    } else if (error && message) {
      setNotification({ type: 'error', message: decodeURIComponent(message) });
    }

    // Clear URL params after displaying
    if (success || error) {
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      url.searchParams.delete('error');
      url.searchParams.delete('message');
      url.searchParams.delete('service');
      window.history.replaceState({}, '', url.pathname);
    }
  }, [searchParams]);

  // Auto-dismiss notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const findIntegration = useCallback(
    (service: GoogleService) => integrations.find((i) => i.service === service),
    [integrations]
  );

  const handleConnect = useCallback(
    async (service: GoogleService) => {
      setLoadingService(service);
      try {
        const result = await initiateOAuthConnection(service);
        if (result.success && result.data) {
          // Redirect to Google OAuth
          window.location.href = result.data;
        } else {
          setNotification({
            type: 'error',
            message: result.error || 'Failed to initiate connection.',
          });
          setLoadingService(null);
        }
      } catch (err: unknown) {
        setNotification({
          type: 'error',
          message: err instanceof Error ? err.message : 'Connection failed.',
        });
        setLoadingService(null);
      }
    },
    []
  );

  const handleDisconnect = useCallback(
    async (service: GoogleService) => {
      if (!confirm(`Are you sure you want to disconnect ${service.replace('_', ' ')}?`)) return;
      setLoadingService(service);
      try {
        const result = await disconnectIntegration(service);
        if (result.success) {
          setNotification({
            type: 'success',
            message: `${service.replace('_', ' ')} disconnected.`,
          });
          startTransition(() => router.refresh());
        } else {
          setNotification({ type: 'error', message: result.error || 'Disconnect failed.' });
        }
      } catch (err: unknown) {
        setNotification({
          type: 'error',
          message: err instanceof Error ? err.message : 'Disconnect failed.',
        });
      } finally {
        setLoadingService(null);
      }
    },
    [router, startTransition]
  );

  const handleRefresh = useCallback(
    async (service: GoogleService) => {
      setLoadingService(service);
      try {
        const result = await refreshIntegration(service);
        if (result.success) {
          setNotification({
            type: 'success',
            message: `${service.replace('_', ' ')} refreshed.`,
          });
          startTransition(() => router.refresh());
        } else {
          setNotification({ type: 'error', message: result.error || 'Refresh failed.' });
        }
      } catch (err: unknown) {
        setNotification({
          type: 'error',
          message: err instanceof Error ? err.message : 'Refresh failed.',
        });
      } finally {
        setLoadingService(null);
      }
    },
    [router, startTransition]
  );

  const isLoading = (service: GoogleService) =>
    loadingService === service || isPending;

  // ─── Configuration Warning ──────────────────────────────────────────────────

  if (!oauthConfigured) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-amber-900">
              Google OAuth Not Configured
            </h2>
            <p className="mt-1 text-sm text-amber-700">
              To enable Google integrations, the following environment variables must be configured
              on the server:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li className="flex items-center gap-2">
                {configStatus.hasClientId ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-mono">
                  GOOGLE_CLIENT_ID
                </code>
              </li>
              <li className="flex items-center gap-2">
                {configStatus.hasClientSecret ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-mono">
                  GOOGLE_CLIENT_SECRET
                </code>
              </li>
              <li className="flex items-center gap-2">
                {configStatus.hasEncryptionKey ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-mono">
                  INTEGRATION_SECRET_KEY
                </code>
              </li>
            </ul>
            <p className="mt-4 text-xs text-amber-600">
              See the Google Cloud setup checklist in your project documentation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main UI ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Notification Banner */}
      {notification && (
        <div
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
            notification.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Google Analytics Card */}
      <IntegrationCard
        title="Google Analytics"
        description="Track website traffic, user behavior, and conversion metrics with GA4."
        icon={<BarChart3 className="h-6 w-6 text-blue-600" />}
        integration={findIntegration('analytics')}
        service="analytics"
        loading={isLoading('analytics')}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onRefresh={handleRefresh}
        renderMeta={(meta) => (
          <MetadataGrid
            items={[
              { label: 'Property Name', value: meta.ga_property_name as string },
              { label: 'Property ID', value: meta.ga_property_id as string },
              {
                label: 'Measurement ID',
                value: meta.ga_measurement_id as string,
                highlight: true,
              },
              { label: 'Account ID', value: meta.ga_account_id as string },
            ]}
          />
        )}
      />

      {/* Google Search Console Card */}
      <IntegrationCard
        title="Google Search Console"
        description="Monitor search performance, indexing status, and submit sitemaps."
        icon={<Globe className="h-6 w-6 text-green-600" />}
        integration={findIntegration('search_console')}
        service="search_console"
        loading={isLoading('search_console')}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onRefresh={handleRefresh}
        renderMeta={(meta) => (
          <MetadataGrid
            items={[
              { label: 'Property', value: meta.site_url as string },
              { label: 'Permission', value: meta.permission_level as string },
              { label: 'Sitemap URL', value: meta.sitemap_url as string },
              { label: 'Sitemap Status', value: meta.sitemap_status as string },
              { label: 'Last Submitted', value: meta.sitemap_last_submitted as string },
            ]}
          />
        )}
      />

      {/* Google Ads Card */}
      <IntegrationCard
        title="Google Ads"
        description="Connect your Google Ads account for campaign management and reporting."
        icon={<Megaphone className="h-6 w-6 text-yellow-600" />}
        integration={findIntegration('ads')}
        service="ads"
        loading={isLoading('ads')}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onRefresh={handleRefresh}
        extraInfo={
          !configStatus.hasAdsDevToken ? (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Google Ads requires a developer token.{' '}
                <code className="font-mono bg-amber-100 px-1 rounded">
                  GOOGLE_ADS_DEVELOPER_TOKEN
                </code>{' '}
                is not configured.
              </span>
            </div>
          ) : null
        }
        renderMeta={(meta) => (
          <MetadataGrid
            items={[
              { label: 'Customer ID', value: meta.customer_id as string },
              { label: 'Account Name', value: meta.customer_name as string },
              { label: 'Manager ID', value: meta.manager_customer_id as string },
              { label: 'Currency', value: meta.currency_code as string },
            ]}
          />
        )}
      />
    </div>
  );
}

// ─── Integration Card ──────────────────────────────────────────────────────────

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  integration: GoogleIntegrationInfo | undefined;
  service: GoogleService;
  loading: boolean;
  onConnect: (service: GoogleService) => void;
  onDisconnect: (service: GoogleService) => void;
  onRefresh: (service: GoogleService) => void;
  renderMeta?: (meta: Record<string, unknown>) => React.ReactNode;
  extraInfo?: React.ReactNode;
}

function IntegrationCard({
  title,
  description,
  icon,
  integration,
  service,
  loading,
  onConnect,
  onDisconnect,
  onRefresh,
  renderMeta,
  extraInfo,
}: IntegrationCardProps) {
  const isConnected = integration?.status === 'connected';
  const statusDisplay = getStatusDisplay(integration?.status);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-gray-50 p-2.5">{icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-0.5 text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusDisplay.color}`}
        >
          {statusDisplay.icon}
          {statusDisplay.label}
        </div>
      </div>

      {/* Connected Info */}
      {isConnected && integration && (
        <div className="border-t border-gray-100 px-6 py-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium text-gray-700">Google Account:</span>
            <span>{integration.googleAccountEmail || 'Unknown'}</span>
          </div>
          {renderMeta && Object.keys(integration.meta).length > 0 && (
            <div>{renderMeta(integration.meta)}</div>
          )}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Connected: {formatDate(integration.lastConnectedAt)}</span>
            <span>Last synced: {formatDate(integration.lastSyncedAt)}</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {integration?.status === 'error' && (
        <div className="border-t border-red-100 bg-red-50 px-6 py-3">
          <p className="text-sm text-red-700">
            The connection encountered an error. The authorization may have been revoked.
            Try reconnecting or refreshing.
          </p>
        </div>
      )}

      {/* Extra Info (e.g. missing dev token warning) */}
      {extraInfo && <div className="px-6 pb-2">{extraInfo}</div>}

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
        {isConnected ? (
          <>
            <button
              onClick={() => onRefresh(service)}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </button>
            <button
              onClick={() => onDisconnect(service)}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Unplug className="h-4 w-4" />
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={() => onConnect(service)}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
            Connect {title}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Metadata Grid ─────────────────────────────────────────────────────────────

interface MetadataItem {
  label: string;
  value: string | undefined | null;
  highlight?: boolean;
}

function MetadataGrid({ items }: { items: MetadataItem[] }) {
  const filtered = items.filter((item) => item.value);
  if (filtered.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {filtered.map((item) => (
        <div key={item.label} className="flex flex-col">
          <span className="text-xs text-gray-400">{item.label}</span>
          <span
            className={`text-sm ${
              item.highlight
                ? 'font-mono font-semibold text-indigo-700'
                : 'text-gray-700'
            }`}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
