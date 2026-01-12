const BASE_URL = "https://app.entropretty.com"

export interface GenerateResult {
  success: boolean
  type: "og" | "twitter"
  algorithmId: number
  status?: number
  error?: string
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function generateOGImage(
  algorithmId: number,
): Promise<GenerateResult> {
  try {
    const response = await fetch(`${BASE_URL}/api/og/${algorithmId}`, {
      method: "GET",
      redirect: "follow",
    })

    return {
      success: response.ok || response.status === 302,
      type: "og",
      algorithmId,
      status: response.status,
    }
  } catch (error) {
    return {
      success: false,
      type: "og",
      algorithmId,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function generateTwitterImage(
  algorithmId: number,
): Promise<GenerateResult> {
  try {
    const response = await fetch(`${BASE_URL}/api/twitter/${algorithmId}`, {
      method: "GET",
      redirect: "follow",
    })

    return {
      success: response.ok || response.status === 302,
      type: "twitter",
      algorithmId,
      status: response.status,
    }
  } catch (error) {
    return {
      success: false,
      type: "twitter",
      algorithmId,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function generateSocialImages(
  algorithmId: number,
  delayMs: number = 1000,
): Promise<{ og: GenerateResult; twitter: GenerateResult }> {
  const og = await generateOGImage(algorithmId)
  await delay(delayMs)
  const twitter = await generateTwitterImage(algorithmId)
  return { og, twitter }
}
